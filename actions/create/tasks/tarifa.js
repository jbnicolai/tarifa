var Q = require('q'),
    fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    ncp = require('ncp').ncp,
    settings = require('../../../lib/settings');

/* task goals
 * 1 create project folder
 * 2 create empty www project in project
 * 3 create tarifa.json file
 */

/* tarifa.json should look like:

   {
        "name":"tarifa-example",
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
        "configuration":{
            "app_label":"tarifa example",
            "id":"com.fortytwoloops.tarifa_example"
        },
        "configurations":{
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
                "id":"com.fortytwoloops.tarifa_demo"
            }
        },
        "deploy": {
            "hockeyapp_user":"toto",
            "hockeyapp_token":"arandomtoken",
            "apple_id":"toto@42loops.com"
        }
   }

*/

// TODO to remove
function createTarifaJSONFile(response) {

    var conf = {};

    conf.id = response.id;
    conf.name = response.name;
    conf.platforms = response.targets;
    conf.plugins = response.plugins;
    conf.project_output = response.project_output;
    conf.build = response.build;

    fs.writeFileSync(path.join(response.path, 'tarifa.json'), JSON.stringify(conf, null, 2), 'utf-8');
    return response;
}

// TODO to remove
function createConfigurationFile(response, mode, platform, outputPath) {
    var conf = {};

    conf.label = mode + ' ' + response.name;
    conf.mode = mode;
    conf.name = response.name;
    conf.id = response.id;

    fs.writeFileSync(outputPath, JSON.stringify(conf, null, 2), 'utf-8');
}

// TODO to remove
function createConfigurations(response) {
    fs.mkdirSync(path.join(response.path, 'configuration'));
    response.targets.forEach(function (target) {
        fs.mkdirSync(path.join(response.path, 'configuration', target));
        settings.configurations.forEach(function(mode){
            createConfigurationFile(response, mode, target, path.join(response.path, 'configuration', target, mode + '.json'));
        });
    });
    return response;
}

function log(response) {
    if (response.verbose) console.log('\n' + chalk.green('✔') + ' project folders created ' + response.path);
    return Q.resolve(response);
}

module.exports = function (response) {
    fs.mkdirSync(response.path);
    fs.mkdirSync(path.join(response.path, settings.webAppPath));

    ncp.limit = 42;

    var source = path.join(__dirname, '../../../template/project');
    var destination = path.join(response.path, settings.webAppPath);
    var defer = Q.defer();

    ncp(source, destination, function (err) {
        if (err) return defer.reject(err);
        defer.resolve(response);
    });

    return defer.promise.then(createTarifaJSONFile)
        .then(createConfigurations)
        .then(log);
};
