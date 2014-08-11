var Q = require('q'),
    chalk = require('chalk'),
    spinner = require("char-spinner"),
    ncp = require('ncp').ncp,
    exec = require('child_process').exec,
    path = require('path'),
    fs = require('fs'),
    tmp = require('tmp'),
    print = require('../../../lib/helper/print'),
    tarifaFile = require('../../../lib/tarifa-file'),
    tarifaPath = require('../../../lib/helper/path'),
    provisionFileParse = require('../../../lib/ios/parse-mobileprovision'),
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

function usage(msg) {
    print(fs.readFileSync(path.join(__dirname , '..', 'usage.txt'), 'utf-8'));
    return Q.reject(msg);
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
        if(!localSettings.configurations['ios'][conf]) {
            return Q.reject('Error: configuration ' + conf + 'not found!');
        } else {
            return askPassword().then(function (password) {
                return [password, localSettings];
            });
        }
    }).spread(function (password, localSettings) {
        spinner();
        return downloadProvisioning(
            localSettings.deploy.apple_id,
            localSettings.deploy.apple_developer_team,
            password,
            localSettings.configurations['ios'][conf].provisioning_profile_name,
            localSettings.configurations['ios'][conf].provisioning_profile_path,
            verbose
        );
    });
}

module.exports = {
    fetch : fetch,
    list : printList
};
