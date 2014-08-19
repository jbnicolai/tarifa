var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
    argsHelper = require('../../lib/helper/args'),
    devices = require('./ios/devices'),
    assets = require('./assets'),
    print = require('../../lib/helper/print'),
    provisioning = require('./ios/provisioning');

var deployƒ = function (conf) {
    // TODO
};

var deploy = function (platform, verbose) {
    var cwd = process.cwd();
    var tarifaFilePath = path.join(cwd, 'tarifa.json');

    // for now we impose 'staging' env as deploy env... this can change
    var config = 'staging';

    return tarifaFile.parseConfig(tarifaPath.current(), platform, config).then(function (localSettings) {
        if (!localSettings.hockeyapp_id)
            return Q.reject('No hockeyapp_id key is available in staging for current platform');

        return tarifaFile.parseConfig(tarifaPath.current()).then(function (globalSettings) {
            if(!globalSettings.deploy || !globalSettings.deploy.hockeyapp_user || !globalSettings.deploy.hockeyapp_token)
                return Q.reject("No deploy informations are available in the current tarifa.json file for the chooses provider (hockeyapp)");

            return deployƒ({
                hockeyappUser: globalSettings.deploy.hockeyapp_user,
                hockeyappToken: globalSettings.deploy.hockeyapp_token,
                platform: platform,
                configuration: config,
                localSettings: localSettings,
                verbose: verbose
            });
        });
    });
};


var action = function (argv) {
    var verbose = false,
        helpPath = path.join(__dirname, 'usage.txt');

    if(argsHelper.matchArgumentsCount(argv, [1])
            && argsHelper.checkValidOptions(argv, ['V', 'verbose'])) {
        if(argsHelper.matchOption(argv, 'V', 'verbose')) {
            verbose = true;
        }
        return deploy(argv._[0], verbose);
    }
    return fs.read(helpPath).then(print);
};

module.exports = action;
