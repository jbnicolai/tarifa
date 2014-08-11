var Q = require('q'),
    chalk = require('chalk'),
    spinner = require("char-spinner"),
    format = require('util').format,
    print = require('../../../lib/helper/print'),
    tarifaFile = require('../../../lib/tarifa-file'),
    tarifaPath = require('../../../lib/helper/path'),
    provisioningList = require('../../../lib/ios/nomad/provisioning/list'),
    downloadProvisioning = require('../../../lib/ios/nomad/provisioning/download'),
    askPassword = require('./ask_password');

function list(verbose) {
    return tarifaFile.parseConfig(tarifaPath.current())
        .then(function (localSettings) {
            spinner();
            return askPassword().then(function (password) {
                var id = localSettings.deploy.apple_id,
                    team = localSettings.deploy.apple_developer_team;
                return provisioningList(id, team, password, verbose);
            });
        });
}

function printList(verbose) {
    return list(verbose).then(function (items) {
        print(chalk.underline("\nActive provisioning profiles:"));
        items.forEach(function (item) {
            print("appid: %s name: %s", chalk.yellow(item[1]), chalk.cyan(item[0]));
        });
    });
}

function fetch(name, conf, verbose) {
    return tarifaFile.parseConfig(tarifaPath.current()).then(function (localSettings) {
        var config = localSettings.configurations['ios'][conf];
        if(!config) {
            return Q.reject(format('Error: configuration %s not found!', conf);
        } else {
            return askPassword().then(function (password) {
                return [password, localSettings];
            });
        }
    }).spread(function (password, localSettings) {
        spinner();
        var id = localSettings.deploy.apple_id,
            team = localSettings.deploy.apple_developer_team,
            profile_name = localSettings.deploy.provisioning_profile_name,
            profile_path = localSettings.deploy.provisioning_profile_name;

        return downloadProvisioning(id, team, password, profile_name, profile_path, verbose);
    });
}

module.exports = {
    fetch : fetch,
    list : printList
};
