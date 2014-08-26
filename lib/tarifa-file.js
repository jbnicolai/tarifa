var Q = require('q'),
    path = require('path'),
    fs = require('fs'),
    uuid = require('uuid'),
    util = require('util'),
    mergeObject = require('./helper/collections').mergeObject,
    validator = require('./helper/validator'),
    settings = require('./settings');

/* tarifa.json should look like:

   {
        "name":"tarifaExample",
        // default cordova project id
        "id":"com.42loops.com"
        "description":"this is a tarifa example app",
        "version":"0.0.0",
        "platforms": [
            "ios",
            "android"
        ],
        "author": {
            "name":"Mr Smith",
            "email":"my@mail.com",
            "href":"http:42loops.com"
        },
        "plugins":[
            "org.apache.cordova.console",
            "org.apache.cordova.device"
        ],
        "cordova":{
            "preferences": {
                "EnableViewportScale": false,
                "KeyboardDisplayRequiresUserAction": false,
                "AutoHideSplashScreen": false,
                "StatusBarBackgroundColor": "#76BDFF"
            },
            "accessOrigin" : ['*']
        },
        "configurations":{
            "ios" : {
                "default":{
                    // bundleid / default package name
                    "id":"com.fortytwoloops.tarifa_example_test",
                    // product name is what the user read
                    "product_name":"oops test",
                    // product file name (apk, ipa)
                    "product_file_name":"oops-test"
                },
                "dev":{
                    "id":"com.fortytwoloops.tarifa_example_dev",
                    "product_name":"oops dev",
                    "product_file_name":"oops-dev"
                },
                "stage":{
                    "id":"com.fortytwoloops.tarifa_example_staging",
                    "product_name":"oops stage",
                    "product_file_name":"oops-stage",
                    "apple_developer_identity":"PAUL PANSERRIEU (XXXXXXXXXX)",
                    "provisioning_profile_path":"/path/to/the/provisioning-file.mobileprovision",
                    "provisioning_profile_name":"toto"
                },
                "prod":{
                    "id":"com.fortytwoloops.tarifa_example",
                    "product_name":"oops",
                    "product_file_name":"oops"
                }
            },
            "android" : {
                "default":{
                    "id":"com.fortytwoloops.tarifa_example_test",
                    "product_name":"oops test",
                    "product_file_name":"oops-test"
                },
                "dev":{
                    "id":"com.fortytwoloops.tarifa_example_test_dev",
                    "product_name":"oops dev",
                    "product_file_name":"oops-dev"
                },
                "stage":{
                    "id":"com.fortytwoloops.tarifa_example_test_staging",
                    "product_name":"oops stage",
                    "product_file_name":"oops-stage"
                },
                "prod":{
                    "id":"com.fortytwoloops.tarifa_example_test",
                    "product_name":"oops",
                    "product_file_name":"oops",
                    "keystore_path":"path/to/key_store",
                    "keystore_alias":"myalias",
                    "versionCode":"1"
                }
            }
        },
        "deploy": {
            "hockeyapp_user":"toto",
            "hockeyapp_token":"arandomtoken",
            "apple_id":"toto@42loops.com",
            "apple_developer_team":"MYTEAM"
        }
   }

*/

function _cordovaDefaultSettings(response) {
    return settings.cordova_config;
}

function parseResponse(response) {
    var o = {};

    o.name = response.name;
    o.id = response.id;
    o.description = response.description;
    o.version = "0.0.0";
    o.platforms = response.platforms;
    o.plugins = response.plugins;
    o.configurations = {};

    o.cordova = _cordovaDefaultSettings(response);

    o.author = {
        name : response.author_name,
        email : response.author_email,
        href : response.author_href
    };

    response.platforms.forEach(function (platform) {
        o.configurations[platform] = rawPlatformConfigObject(platform, o);
    });

    if(response.deploy) {
        o.deploy = {
            // FIXME
            // ask a question to get the credentials
            // hockeyapp_user : response.hockeyapp_user,
            // hockeyapp_token : response.hockeyapp_token,
            hockeyapp_apiurl: 'https://rink.hockeyapp.net/api/2',
            hockeyapp_token: 'put your hockeyapp token here',
            // FIXME we can't store this kind of stuff in a tarifa.json file?
            apple_id : response.apple_id
        };
    }

    if(response.keystore_path && response.keystore_alias) {
        o.configurations.android.prod.keystore_path = response.keystore_path;
        o.configurations.android.prod.keystore_alias = response.keystore_alias;
        o.configurations.android.prod.version_code = "1";
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

function writeJSON(destFolder, obj) {
    writeJSONFile(path.join(destFolder, 'tarifa.json'), obj);
}

function writeJSONFile(filePath, obj) {
    fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf-8');
}

function formatError(msg) {
    return util.format('in tarifa.json, %s', msg);
}

var tarifaFile = {};

/*
 * Create a tarifa.json file from tarifa 'create' command response
 */
tarifaFile.createFileFromResponse = function (response) {
    writeJSON(response.path, parseResponse(response));
    return Q.resolve(response);
};

/*
 * parse a tarifa.json file for a given platform
 */
tarifaFile.parseConfig = function (filePath, platform, config) {
    if(!fs.existsSync(filePath))
        return Q.reject(new Error('tarifa.json file does not exist!'));
    var localSettings = require(filePath);
    return Q.resolve(localSettings)
    // validate settings globally
    .then(function(obj) {
        if (platform && obj.platforms.indexOf(platform) < 0)
            return Q.reject(new Error(formatError('platform not described')));

        if (platform && !obj.configurations[platform] && !obj.configurations[platform]['default'])
            return Q.reject(new Error(formatError('configuration \'default\' not described for ' + platform + ' platform')));

        if (platform && config && !obj.configurations[platform][config])
            return Q.reject(new Error(formatError('configuration ' + config + ' not described for ' + platform + ' platform')));

        return obj;
    })
    // validate platform specific settings
    .then(function(obj) {

        if (platform) {

            var config = config || 'default';

            var conf = obj.configurations[platform][config];
            var def = obj.configurations[platform]['default'];
            var merged = mergeObject(def, conf);
            var platformPath = ['configurations', platform, config].join('.');

            if (!validator.isProductName(merged.product_name))
                return Q.reject(new Error(formatError('[' + platformPath + '.product_name] ' + validator.isProductName.error)));
            if (!validator.isProductFileName(merged.product_file_name.trim()))
                return Q.reject(new Error(formatError('[' + platformPath + '.product_file_name] ' + validator.isProductFileName.error)));

            if(platform === 'android' && !validator.isAndroidPackageName(merged.id))
                return Q.reject(new Error(formatError('[' + platformPath + '.id] ' + validator.isAndroidPackageName.error)));
            if(platform === 'ios' && !validator.isBundleId(merged.id.trim()))
                return Q.reject(new Error(formatError('[' + platformPath + '.id] ' + validator.isBundleId.error)));
        }

        return obj;
    });
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

    if(platform === 'windows8') {
        o['default'].package_id = obj.id;
    }

    settings.configurations.forEach(function (conf) {
        o[conf] = {
            id : obj.id,
            product_name : obj.name + ' ' + conf,
            product_file_name : obj.name.replace(/ /g, '-')
        };
        if(platform === 'wp8') {
            o[conf].guid = uuid.v4();
            if(conf === 'prod' || conf === 'stage')
                o[conf].release_mode = true;
            if(conf === 'stage' && obj.deploy)
                o[conf].sign_mode = true;

        }
        if(platform === 'windows8') {
            o[conf].package_id = obj.id;
            if(conf === 'prod' || conf === 'stage')
                o[conf].release_mode = true;
        }
    });
    return o;
};

tarifaFile.addPlugin = function (filePath, name) {
    return tarifaFile.parseConfig(filePath).then(function (obj) {
        obj.plugins.push(name);
        writeJSONFile(filePath, obj);
        return Q.resolve(name);
    });
};

tarifaFile.removePlugin = function (filePath, name) {
    return tarifaFile.parseConfig(filePath).then(function (obj) {
        obj.plugins = obj.plugins.filter(function (p) {
            return p !== name;
        });
        writeJSONFile(filePath, obj);
        return Q.resolve(name);
    });
};

tarifaFile.addPlatform = function (filePath, platform) {
    return tarifaFile.parseConfig(filePath).then(function (obj) {
        if(obj.platforms.indexOf(platform) > -1)
            return Q.reject('Platform already installed!');
        obj.platforms.push(platform);
        obj.configurations[platform] = rawPlatformConfigObject(platform, obj);
        writeJSONFile(filePath, obj);
        return Q.resolve(obj);
    });
};

tarifaFile.removePlatform = function (filePath, platform) {
    return tarifaFile.parseConfig(filePath, platform).then(function (obj) {
        obj.platforms = obj.platforms.filter(function (p) {
            return p !== platform;
        });
        delete obj.configurations[platform];
        writeJSONFile(filePath, obj);
        return Q.resolve(obj);
    });
};

module.exports = tarifaFile;
