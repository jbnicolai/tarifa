var Q = require('q'),
    path = require('path'),
    fs = require('fs'),
    uuid = require('uuid'),
    validJavaIdentifier = require('valid-java-identifier'),
    mergeObject = require('./helper/mergeObject'),
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
                "developpement":{
                    "id":"com.fortytwoloops.tarifa_example_dev",
                    "product_name":"oops dev",
                    "product_file_name":"oops-dev"
                },
                "staging":{
                    "id":"com.fortytwoloops.tarifa_example_staging",
                    "product_name":"oops staging",
                    "product_file_name":"oops-staging",
                    "apple_developer_identity":"PAUL PANSERRIEU (XXXXXXXXXX)",
                    "provisioning_profile_path":"/path/to/the/provisioning-file.mobileprovision",
                    "provisioning_profile_name":"toto"
                },
                "production":{
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
                "developpement":{
                    "id":"com.fortytwoloops.tarifa_example_test_dev",
                    "product_name":"oops dev",
                    "product_file_name":"oops-dev"
                },
                "staging":{
                    "id":"com.fortytwoloops.tarifa_example_test_staging",
                    "product_name":"oops staging",
                    "product_file_name":"oops-staging"
                },
                "production":{
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
            // no hockeyapp stuff for now!
            // hockeyapp_user : response.hockeyapp_user,
            // hockeyapp_token : response.hockeyapp_token,
            // FIXME we can't store this kind of stuff in a tarifa.json file?
            apple_id : response.apple_id
        };
    }

    if(response.keystore_path && response.keystore_alias) {
        o.configurations.android.production.keystore_path = response.keystore_path;
        o.configurations.android.production.keystore_alias = response.keystore_alias;
        o.configurations.android.production.version_code = "1";
    }

    if(response.apple_developer_identity && response.provisioning_profile_path && response.provisioning_profile_name) {
        o.configurations.ios.staging.apple_developer_identity = response.apple_developer_identity;
        o.configurations.ios.staging.provisioning_profile_path = response.provisioning_profile_path;
        o.configurations.ios.staging.provisioning_profile_name = response.provisioning_profile_name;
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
    return 'Error in tarifa.json: ' + msg;
}

// validation functions
function validProductName(string) {
    return typeof string === "string";
}

function validProductFileName(string) {
    return /^[\w,-,_,0-9]+$/.test(string.trim());
}

function validIdForAJavaPackage(string) {
    if(typeof string !== 'string') return false;

    var rslt = string.split('.');

    return rslt.filter(function (name) {
        return validJavaIdentifier(name);
    }).length === rslt.length;
}

function validIdForABundleId(string) {
    return /^[A-Z,a-z,0-9,-,.]+$/.test(string.trim());
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

            if (!validProductName(merged.product_name))
                throw new Error(formatError('[' + platformPath + '.product_name] must be a string'));
            if (!validProductFileName(merged.product_file_name))
                throw new Error(formatError('[' + platformPath + '.product_file_name] must be a valid ascii string'));

            if(platform === 'android' && !validIdForAJavaPackage(merged.id))
                throw new Error(formatError('[' + platformPath + '.id] must be a valid java class name'));
            if(platform === 'ios' && !validIdForABundleId(merged.id))
                throw new Error(formatError('[' + platformPath + '.id] must be a string that contains only alphanumeric characters (A-Z,a-z,0-9), hyphen (-), and period (.)'));
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

    settings.configurations.forEach(function (conf) {
        o[conf] = {
            id : obj.id,
            product_name : obj.name + ' ' + conf,
            product_file_name : obj.name.replace(/ /g, '-')
        };
        if(platform === 'wp8') {
            o[conf].guid = uuid.v4();
            if(conf === 'production' || conf === 'staging')
                o[conf].release_mode = true;
            if(conf === 'staging' && obj.deploy)
                o[conf].sign_mode = true;

        }
    });
    return o;
};

tarifaFile.addPlatform = function (filePath, platform) {
    return tarifaFile.parseConfig(filePath).then(function (obj) {
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
