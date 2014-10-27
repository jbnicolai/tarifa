var Q = require('q'),
    path = require('path'),
    fs = require('q-io/fs'),
    uuid = require('uuid'),
    util = require('util'),
    collections = require('../helper/collections'),
    settings = require('../settings');

function parseResponse(response) {
    function cordovaDefaultSettings() {
        return settings.cordova_config;
    }

    var o = {};

    o.name = response.name;
    o.id = response.id;
    o.description = response.description;
    o.version = "0.0.0";

    o.platforms = response.platforms;
    o.plugins = {};
    o.configurations = {};

    o.cordova = cordovaDefaultSettings();

    o.author = {
        name : response.author_name,
        email : response.author_email,
        href : response.author_href
    };

    o.check = {};

    response.platforms.forEach(function (platform) {
        o.configurations[platform] = rawPlatformConfigObject(platform, o);
        o.check[platform] = util.format("./project/bin/check_%s.js", platform);
    });

    if(response.deploy) {
        o.deploy = {
            apple_id : response.apple_id
        };
    }

    if (response.hockeyapp) {
        o.hockeyapp = {
            api_url: 'https://rink.hockeyapp.net/api/2',
            versions_notify: '0',
            versions_status: '1',

            token: response.hockeyapp_token
        };
        if (response.platforms.indexOf('ios') !== -1) {
          o.configurations.ios.stage.hockeyapp_id = "put here your hockeyapp app id";
        }
        if (response.platforms.indexOf('android') !== -1) {
          o.configurations.android.stage.hockeyapp_id = "put here your hockeyapp app id";
        }
    }

    if(response.keystore_path && response.keystore_alias) {
        o.configurations.android.prod.keystore_path = response.keystore_path;
        o.configurations.android.prod.keystore_alias = response.keystore_alias;
    }

    if(response.apple_developer_identity && response.provisioning_profile_path && response.provisioning_profile_name) {
        o.configurations.ios.stage.apple_developer_identity = response.apple_developer_identity;
        o.configurations.ios.stage.provisioning_profile_path = response.provisioning_profile_path;
        o.configurations.ios.stage.provisioning_profile_name = response.provisioning_profile_name;
    }

    if(response.has_apple_developer_team && response.apple_developer_team) {
        o.deploy.apple_developer_team = response.apple_developer_team;
    }

    return o;
}

function isPrivateKey (key) {
    var privateKeys = [
        'apple_developer_identity', // ios
        'deploy.apple_developer_team', // ios
        'deploy.apple_id', // ios
        'hockeyapp.token', // all
        'hockeyapp_id', // all
        'keystore_alias', // android
        'keystore_path', // android
        'provisioning_profile_name', // ios
        'provisioning_profile_path' // ios
    ];
    return privateKeys.filter(function (privKey) {
        // key must end with privKey
        return key.indexOf(privKey, key.length - privKey.length) > -1;
    }).length > 0;
}

function write(dirname, obj) {

    if(obj.project_output === settings.project_output) delete obj.project_output;

    var publicPath = path.join(dirname, settings.publicTarifaFileName),
        privatePath = path.join(dirname, settings.privateTarifaFileName),
        oneLvlObj = collections.toOneLevelObject(obj),
        publicObj = collections.toMultiLevelObject(collections.filterKeys(oneLvlObj, function (key) {
            return !isPrivateKey(key);
        })),
        privateObj = collections.toMultiLevelObject(collections.filterKeys(oneLvlObj, isPrivateKey));
    return Q.all([
        fs.write(publicPath, JSON.stringify(publicObj, null, 2)),
        fs.write(privatePath, JSON.stringify(privateObj, null, 2))
    ]);
}

var tarifaFile = {};

tarifaFile.parse = require('./parse');

/*
 * Create tarifa.json files from tarifa 'create' command response
 */
tarifaFile.createFromResponse = function (response) {
    return write(response.path, parseResponse(response)).then(function () { return response; });
};

function rawPlatformConfigObject(platform, obj) {
    var o = {
        'default' : {
            id : obj.id,
            product_name : obj.name,
            product_file_name : obj.name.replace(/ /g, '_')
        }
    };

    if(platform === 'wp8') {
        o['default'].guid = uuid.v4();
    }

    settings.configurations.forEach(function (conf) {
        o[conf] = {
            id : util.format('%s.%s', obj.id, conf),
            product_name : util.format('%s %s', obj.name, conf),
            product_file_name : util.format('%s-%s', obj.name.replace(/ /g, '-'), conf)
        };
        if(platform === 'wp8') {
            o[conf].guid = uuid.v4();
            if(conf === 'prod' || conf === 'stage')
                o[conf].release_mode = true;
            if(conf === 'stage' && obj.deploy)
                o[conf].sign_mode = true;

        }
    });
    return o;
};

tarifaFile.addPlugin = function (dirname, name, uri) {
    return tarifaFile.parse(dirname).then(function (obj) {
        if(!obj.plugins) obj.plugins = {};
        obj.plugins[name] = uri;
        return write(dirname, obj).then(function () { return name; });
    });
};

tarifaFile.removePlugin = function (dirname, name) {
    return tarifaFile.parse(dirname).then(function (obj) {
        if (obj.plugins[name]) delete obj.plugins[name];
        return write(dirname, obj).then(function () { return name; });
    });
};

tarifaFile.addPlatform = function (dirname, platform) {
    var platformName = platform.indexOf('@') > -1 ? platform.split('@')[0] : platform;
    return tarifaFile.parse(dirname).then(function (obj) {
        if(obj.platforms.indexOf(platformName) > -1)
            return Q.reject('Platform already installed!');
        obj.platforms.push(platformName);
        obj.configurations[platformName] = rawPlatformConfigObject(platformName, obj);
        return write(dirname, obj).then(function () { return obj; });
    });
};

tarifaFile.removePlatform = function (dirname, platform) {
    return tarifaFile.parse(dirname, platform).then(function (obj) {
        obj.platforms = obj.platforms.filter(function (p) {
            return p !== platform;
        });
        delete obj.configurations[platform];
        return write(dirname, obj).then(function () { return obj; });
    });
};

module.exports = tarifaFile;
