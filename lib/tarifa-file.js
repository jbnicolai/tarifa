var Q = require('q'),
    path = require('path'),
    fs = require('fs'),
    utils = require('./utils'),
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
        "plugins":[
            "org.apache.cordova.console",
            "org.apache.cordova.device"
        ],
        "configurations":{
            "ios" : {
                "default":{
                    // the label of an application
                    "app_label":"tarifa example",
                    // bundleid / default package name
                    "id":"com.fortytwoloops.tarifa_example",
                    // product file name (apk, ipa)
                    "product_file_name":"oops"
                },
                "developpement":{
                    "app_label":"tarifa dev example",
                    "id":"com.fortytwoloops.tarifa_example_dev"
                },
                "staging":{
                    "app_label":"tarifa staging example",
                    "id":"com.fortytwoloops.tarifa_example_staging",
                    "apple_developer_identity":"PAUL PANSERRIEU (XXXXXXXXXX)",
                    "provisioning_profile":"/path/to/the/provisioning-file"
                },
                "production":{
                    "app_label":"tarifa demo",
                    "id":"com.fortytwoloops.tarifa_demo"
                }
            },
            "android" : {
                "default":{
                    "app_label":"tarifa example",
                    "id":"com.fortytwoloops.tarifa_example"
                },
                "developpement":{
                    "app_label":"tarifa dev example",
                    "id":"com.fortytwoloops.tarifa_example_dev"
                },
                "staging":{
                    "app_label":"tarifa staging example",
                    "id":"com.fortytwoloops.tarifa_example_staging"
                },
                "production":{
                    "app_label":"tarifa demo",
                    "id":"com.fortytwoloops.tarifa_demo",
                    "keystore_path":"path/to/key_store",
                    "keystore_alias":"myalias"
                }
            }
        },
        "deploy": {
            "hockeyapp_user":"toto",
            "hockeyapp_token":"arandomtoken",
            "apple_id":"toto@42loops.com"
        }
   }

*/

function parseResponse(response) {
    var o = {};
    o.name = response.name;
    o.id = response.id;
    o.description = response.description;
    o.version = "0.0.0";
    o.platforms = response.platforms;
    o.plugins = response.plugins;
    o.configurations = {};

    response.platforms.forEach(function (platform) {
        o.configurations[platform] = {
            'default' : {
                app_label : response.name,
                name : response.name,
                id : response.id,
                product_file_name : response.name.replace(/ /g, '_')
            }
        };

        settings.configurations.forEach(function (conf) {
            o.configurations[platform][conf] = {
                app_label : response.name + ' ' + conf,
                name : response.name,
                id : response.id,
                product_file_name : response.name.replace(/ /g, '_')
            };
        });
    });

    if(response.deploy) {
        o.deploy = {
            hockeyapp_user : response.hockeyapp_user,
            hockeyapp_token : response.hockeyapp_token,
            apple_id : response.apple_id
        };
    }

    if(response.keystore_path && response.keystore_alias) {
        o.configurations.android.production.keystore_path = response.keystore_path;
        o.configurations.android.production.keystore_alias = response.keystore_alias;
    }

    if(response.apple_developer_identity && response.provisioning_profile) {
        o.configurations.ios.staging.apple_developer_identity = response.apple_developer_identity;
        o.configurations.ios.staging.provisioning_profile = response.provisioning_profile;
    }

    return o;
}


function writeJSON(destFolder, obj) {
    fs.writeFileSync(path.join(destFolder, 'tarifa.json'), JSON.stringify(obj, null, 2), 'utf-8');
}

function formatError(msg) {
    return 'Error in tarifa.json: ' + msg;
}

// validation functions
function androidAppLabel(string) {
    return typeof string === "string";
}

function androidName(string) {
    return /^\w+$/.test(string.trim());
}

function androidId(string) {
    return /^(\w+\.?)+$/.test(string.trim());
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
        if (obj.platforms.indexOf(platform) < 0)
            throw new Error(formatError('platform not described'));

        if (!obj.configurations[platform] && !obj.configurations[platform]['default'])
            throw new Error(formatError('configuration \'default\' not described for ' + platform + ' platform'));

        if (!obj.configurations[platform][config])
            throw new Error(formatError('configuration ' + config + ' not described for ' + platform + ' platform'));

        return obj;
    })
    // validate platform specific settings
    .then(function(obj) {
        var conf = obj.configurations[platform][config];
        var def = obj.configurations[platform]['default'];
        var merged = utils.mergeObjects(def, conf);
        var platformPath = ['configurations', platform, config].join('.');
        if (platform === 'android') {
            if (!androidAppLabel(merged.app_label))
                throw new Error(formatError('[' + platformPath + '.app_label] must be a string'));
            if (!androidName(merged.name))
                throw new Error(formatError('[' + platformPath + '.name] must be a valid java class name'));
            if (!androidId(merged.id))
                throw new Error(formatError('[' + platformPath + '.id] must be a valid java namespace'));
        }

        return obj;
    });
};

module.exports = tarifaFile;
