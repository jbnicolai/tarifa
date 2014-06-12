var Q = require('q'),
    fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    ncp = require('ncp').ncp,
    settings = require('../../../conf/settings.json');

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

function createConfigurationFile(response, mode, platform, outputPath) {
    var conf = {};

    conf.label = mode + ' ' + response.name;
    conf.mode = mode;
    conf.name = response.name;
    conf.id = response.id;

    fs.writeFileSync(outputPath, JSON.stringify(conf, null, 2), 'utf-8');
}

function createConfigurations(response) {
    fs.mkdirSync(path.join(response.path, 'configuration'));
    response.targets.forEach(function (target) {
        fs.mkdirSync(path.join(response.path, 'configuration', target));
        ['development', 'staging', 'production'].forEach(function(mode){
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
