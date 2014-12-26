var Q = require('q'),
    chalk = require('chalk'),
    spinner = require("char-spinner"),
    print = require('../../../lib/helper/print'),
    tarifaFile = require('../../../lib/tarifa-file'),
    pathHelper = require('../../../lib/helper/path'),
    provisioningList = require('../../../lib/ios/nomad/provisioning/list'),
    askPassword = require('../../../lib/helper/question').password;

function list(verbose) {
    return tarifaFile.parse(pathHelper.root()).then(function (localSettings) {
        if(!localSettings.deploy || !localSettings.deploy.apple_id)
            return Q.reject('no apple_id defined in tarifa.json/private.json!');

        var deploy = localSettings.deploy,
            id = deploy.apple_id,
            team = deploy.apple_developer_team;

        return askPassword('What is your apple developer password?').then(function (password) {
            spinner();
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

module.exports = {
    list : printList
};
