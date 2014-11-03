var path = require('path'),
    Q = require('q'),
    fs = require('q-io/fs'),
    chalk = require('chalk'),
    util = require('util'),
    validator = require('../helper/validator'),
    collections = require('../helper/collections'),
    settings = require('../settings'),
    checkProjectName = require('./validate/name');

function checkKeyStore(platform, config) {
    return function (o) {
        if (platform === 'android' && config
            && o.configurations.android[config]
            && o.configurations.android[config].keystore_path
            && o.configurations.android[config].keystore_alias) {

            var keystore_path = o.configurations.android[config].keystore_path;

            return fs.exists(keystore_path).then(function (exists) {
                return ( !exists
                    ? Q.reject(util.format("keystore file %s does not exist", keystore_path))
                    : o );
            });
        }
        return o;
    };
}

function checkGlobalSettings(platform, config) {
    return function (obj) {
        // allow to override project_output, make sure it's always in conf object
        if(!obj.project_output) obj.project_output = settings.project_output;

        if (platform && obj.platforms.indexOf(platform) < 0)
            return Q.reject(util.format('platform not described'));

        if (platform && !obj.configurations[platform] && !obj.configurations[platform]['default'])
            return Q.reject(util.format('configuration \'default\' not described for %s platform', platform));

        if (platform && config && !obj.configurations[platform][config])
            return Q.reject(util.format('configuration %s not described for %s platform', config, platform));

        if (!validator.isVersion(obj.version))
            return Q.reject(util.format('wrong version format in tarifa.json, only digit.digit.digit format is valid'));

        if (config && obj.configurations[platform][config]['version']
                && !validator.isVersion(obj.configurations[platform][config]['version']))
            return Q.reject(
                util.format('wrong version format in configuration %s on platform %s: %s',
                config,
                platform,
                chalk.magenta(obj.configurations[platform][config]['version'])
            ));

        return obj;
    };
}

function checkConfigurationSettings(platform, config) {
    return function (obj) {
        if (platform) {
            var config = config || 'default',
                platformConfs = obj.configurations[platform],
                conf = platformConfs[config],
                def = platformConfs['default'],
                merged = collections.mergeObject(def, conf),
                platformPath = ['configurations', platform, config].join('.');

            if (!validator.isProductName(merged.product_name))
                return Q.reject(util.format('[%s.product_name] %s', platformPath, validator.isProductName.error));
            if (!validator.isProductFileName(merged.product_file_name.trim()))
                return Q.reject(util.format('[%s.product_file_name] %s', platformPath, validator.isProductFileName.error));

            if(platform === 'android' && !validator.isAndroidPackageName(merged.id))
                return Q.reject(util.format('[%s.id] %s', platformPath, validator.isAndroidPackageName.error));
            if(platform === 'ios' && !validator.isBundleId(merged.id.trim()))
                return Q.reject(util.format('[%s.id] %s', platformPath, validator.isBundleId.error));
        }
        return obj;
    };
}

/*
 * parse tarifa.json files for a given platform
 */

module.exports = function (dirname, platform, config) {
    var publicPath = path.join(dirname, settings.publicTarifaFileName),
        privatePath = path.join(dirname, settings.privateTarifaFileName);
    return Q.all([
        fs.isFile(publicPath),
        fs.isFile(privatePath)
    ]).spread(function (publicFileExists, privateFileExists) {
        if(!publicFileExists)
            return Q.reject(util.format('%s file does not exist!', settings.publicTarifaFileName));

        return Q.all([
            fs.read(publicPath),
            privateFileExists ? fs.read(privatePath) : Q.resolve('{}')
        ]);
    })
    .spread(function (publicSettings, privateSettings) {
        var publicObj = JSON.parse(publicSettings),
            privateObj = JSON.parse(privateSettings),
            mergedObj = collections.mergeObject(publicObj, privateObj, true),
            oneLvlPrivateObj = collections.toOneLevelObject(privateObj),
            descriptor = {
                configurable: false,
                enumerable: false,
                value: collections.mapValues(oneLvlPrivateObj, function (val) { return true; }),
                writable: false
            };
        Object.defineProperty(mergedObj, 'userPrivateKeys', descriptor);
        return mergedObj;
    })
    // validate settings globally
    .then(checkGlobalSettings(platform, config))
    // check if name match native app name
    .then(checkProjectName(dirname, platform))
    // validate platform specific settings
    .then(checkConfigurationSettings(platform, config))
    // android: check if given keystore path exists
    .then(checkKeyStore(platform, config));
};
