var Q = require('q'),
    spinner = require("char-spinner"),
    cordova = require('cordova-lib/src/cordova/cordova'),
    exec = require('child_process').exec,
    path = require('path'),
    fs = require('q-io/fs'),
    argsHelper = require('../../lib/helper/args'),
    print = require('../../lib/helper/print'),
    settings = require('../../lib/settings'),
    tarifaFile = require('../../lib/tarifa-file'),
    pathHelper = require('../../lib/helper/path'),
    isAvailableOnHost = require('../../lib/cordova/platforms').isAvailableOnHost,
    buildAction = require('../build'),
    askDevice = require('./ask_device'),

    tasks = {
        android : [
            './tasks/android/install',
            './tasks/android/open'
        ],
        ios : [ './tasks/ios/install' ],
        wp8: [ './tasks/wp8/install' ],
        web: [ './tasks/web/open' ],
        windows8: [ './tasks/windows8/open' ]
    };

var runƒ = function (conf) {
    return buildAction.buildƒ(conf)
        .then(askDevice)
        .then(function (c) {
            return tasks[c.platform].reduce(function (opt, task) {
                return Q.when(opt, require(task));
            }, c);
        });
};

var run = function (platform, config, verbose) {
    spinner();
    return Q.all([
            tarifaFile.parse(pathHelper.root(), platform, config),
            isAvailableOnHost(platform)
        ]).spread(function (localSettings) {
            return runƒ({
                localSettings: localSettings,
                platform: platform,
                configuration: config,
                verbose: verbose
            });
        });
};

var action = function (argv) {
    var verbose = false,
        helpPath = path.join(__dirname, 'usage.txt');

    if(argsHelper.matchArgumentsCount(argv, [1,2])
            && argsHelper.checkValidOptions(argv, ['V', 'verbose'])) {
        if(argsHelper.matchOption(argv, 'V', 'verbose')) {
            verbose = true;
        }
        return run(argv._[0], argv._[1] || 'default', verbose);
    }

    return fs.read(helpPath).then(print);
};

action.run = run;
module.exports = action;
