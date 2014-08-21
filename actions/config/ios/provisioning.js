var Q = require('q'),
    chalk = require('chalk'),
    spinner = require("char-spinner"),
    print = require('../../../lib/helper/print'),
    tarifaFile = require('../../../lib/tarifa-file'),
    tarifaPath = require('../../../lib/helper/path'),
    provisioningList = require('../../../lib/ios/nomad/provisioning/list'),
    askPassword = require('./ask_password');

function list(verbose) {
    return tarifaFile.parseConfig(tarifaPath.current())
        .then(function (localSettings) {
            return askPassword().then(function (password) {
                spinner();
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

module.exports = {
    list : printList
};
