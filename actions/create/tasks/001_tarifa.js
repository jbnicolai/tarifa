var Q = require('q'),
    fs = require('fs'),
    path = require('path'),
    chalk = require('chalk'),
    settings = require('../../../conf/settings.json');

module.exports = function (response) {
    fs.mkdirSync(response.path);
    fs.mkdirSync(path.join(response.path, settings.webAppPath));
    if (response.verbose) console.log('\n' + chalk.green('✔') + ' project folders created ' + response.path);

    // TODO
    // copy template or project_path to webAppPath
    // template configuration files according to targets (android, ios, ...)
    // create package.json file
    // create tarifa.json file

    return Q.resolve(response);
};
