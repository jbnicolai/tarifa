var Q = require('q'),
    path = require('path'),
    fs = require('fs'),
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
            // FIXME
            // no hockeyapp stuff for now!
            // hockeyapp_user : response.hockeyapp_user,
            // hockeyapp_token : response.hockeyapp_token,
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

    if(response.has_apple_developer_team && response.apple_developer_team) {
        o.deploy.apple_developer_team = response.apple_developer_team;
    }

    return o;
}


function write(destFolder, obj) {
    fs.writeFileSync(path.join(destFolder, 'tarifa.json'), JSON.stringify(obj, null, 2), 'utf-8');
}


var tarifaFile = {};

/*
 * Create a tarifa.json file from tarifa 'create' command response
 */
tarifaFile.createFileFromResponse = function (response) {
    write(response.path, parseResponse(response));
    return Q.resolve(response);
};

/*
 * parse a tarifa.json file for a given configuration
 */
tarifaFile.parseFromFile = function (filePath, platform, config) {
    if(!fs.existsSync(filePath))
        return Q.reject(new Error('tarifa.json file does not exist!'));

    var localSettings = require(filePath);

    if (localSettings.platforms.indexOf(platform) < 0)
        return Q.reject(new Error('platform not described in tarifa.json!'));

    if(!localSettings.configurations[platform][config])
        return Q.reject(new Error('configuration ' + config + ' not described in tarifa.json'));

    return Q.resolve(localSettings);
};

module.exports = tarifaFile;
