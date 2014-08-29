var Q = require('q'),
    path = require('path'),
    fs = require('q-io/fs'),
    uuid = require('uuid'),
    util = require('util'),
    collections = require('./helper/collections'),
    validator = require('./helper/validator'),
    settings = require('./settings');

/* tarifa.json files should look like this:

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
            },
            "wp8": {
                "default": {
                    "id": "com.fortytwoloops.tarifa_example",
                    "product_name": "tarifa example",
                    "product_file_name": "tarifaexample",
                    "guid": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                },
                "dev": {
                    "id": "com.fortytwoloops.tarifa_dev",
                    "product_name": "tarifa dev",
                    "product_file_name": "tarifadev",
                    "guid": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                },
                "stage": {
                    "id": "com.fortytwoloops.tarifa_stage",
                    "product_name": "tarifa stage",
                    "product_file_name": "tarifastage",
                    "guid": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
                    "release_mode": true,
                    "sign_mode": true
                },
                "prod": {
                    "id": "com.fortytwoloops.tarifa_prod",
                    "product_name": "tarifa",
                    "product_file_name": "tarifa",
                    "guid": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
                    "release_mode": true
                }
            },
            "windows8": {
                "default": {
                    "id": "com.fortytwoloops.tarifa_example",
                    "product_name": "tarifa example",
                    "product_file_name": "tarifaexample"
                },
                "dev": {
                    "id": "com.fortytwoloops.tarifa_dev",
                    "product_name": "tarifa dev",
                    "product_file_name": "tarifadev"
                },
                "stage": {
                    "id": "com.fortytwoloops.tarifa_stage",
                    "product_name": "tarifa stage",
                    "product_file_name": "tarifastage",
                    "release_mode": true
                },
                "prod": {
                    "id": "ccom.fortytwoloops.tarifa_prod",
                    "product_name": "tarifa prod",
                    "product_file_name": "tarifaprod",
                    "package_id": "2530542loops.zanimo.jsdesktopeditor",
                    "release_mode": true,
                    "publisher": "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
                }
            }
        },
        "deploy": {
            "apple_id":"toto@42loops.com",
            "apple_developer_team":"MYTEAM"
        },
        "hockeyapp": {
            "token": "arandomtoken"
        }
   }

*/

function parseResponse(response) {
    function cordovaDefaultSettings() {
        return settings.cordova_config;
    }

    var o = {};

    o.name = response.name;
    o.id = response.id;
    o.description = response.description;
    o.version = "0.0.0";

    // web platform is added by default
    response.platforms.push('web');
    o.platforms = response.platforms;
    o.plugins = response.plugins;
    o.configurations = {};

    o.cordova = cordovaDefaultSettings();

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
        'provisioning_profile_path', // ios
        'publisher' // windows8
    ];
    return privateKeys.filter(function (privKey) {
        // key must end with privKey
        return key.indexOf(privKey, key.length - privKey.length) > -1;
    }).length > 0;
}

function write(dirname, obj) {
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

/*
 * Create tarifa.json files from tarifa 'create' command response
 */
tarifaFile.createFromResponse = function (response) {
    return write(response.path, parseResponse(response)).then(function () { return response; });
};

/*
 * parse tarifa.json files for a given platform
 */
tarifaFile.parse = function (dirname, platform, config) {
    var publicPath = path.join(dirname, settings.publicTarifaFileName),
        privatePath = path.join(dirname, settings.privateTarifaFileName);
    return Q.all([
        fs.isFile(publicPath),
        fs.isFile(privatePath)
    ]).spread(function (publicFileExists, privateFileExists) {
        if(!publicFileExists)
            return Q.reject(util.format('%s file does not exist!', settings.publicTarifaFileName));
        var publicObj = require(publicPath),
            privateObj = privateFileExists ? require(privatePath) : {},
            localSettings = collections.mergeObject(publicObj, privateObj, true);
        return localSettings;
    })
    // validate settings globally
    .then(function(obj) {
        if (platform && obj.platforms.indexOf(platform) < 0)
            return Q.reject(util.format('platform not described'));

        if (platform && !obj.configurations[platform] && !obj.configurations[platform]['default'])
            return Q.reject(util.format('configuration \'default\' not described for %s platform', platform));

        if (platform && config && !obj.configurations[platform][config])
            return Q.reject(util.format('configuration %s not described for %s platform', config, platform));

        return obj;
    })
    // validate platform specific settings
    .then(function(obj) {
        if (platform) {

            var config = config || 'default';

            var conf = obj.configurations[platform][config];
            var def = obj.configurations[platform]['default'];
            var merged = collections.mergeObject(def, conf);
            var platformPath = ['configurations', platform, config].join('.');

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

tarifaFile.addPlugin = function (dirname, name) {
    return tarifaFile.parse(dirname).then(function (obj) {
        obj.plugins.push(name);
        return write(dirname, obj).then(function () { return name; });
    });
};

tarifaFile.removePlugin = function (dirname, name) {
    return tarifaFile.parse(dirname).then(function (obj) {
        obj.plugins = obj.plugins.filter(function (p) {
            return p !== name;
        });
        return write(dirname, obj).then(function () { return name; });
    });
};

tarifaFile.addPlatform = function (dirname, platform) {
    return tarifaFile.parse(dirname).then(function (obj) {
        if(obj.platforms.indexOf(platform) > -1)
            return Q.reject('Platform already installed!');
        obj.platforms.push(platform);
        obj.configurations[platform] = rawPlatformConfigObject(platform, obj);
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
