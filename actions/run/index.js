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
    platformsLib = require('../../lib/cordova/platforms'),
    buildAction = require('../build'),
    askDevice = require('./ask_device'),

    tasks = {
        android : [
            './tasks/android/install',
            './tasks/android/open'
        ],
        ios : [ './tasks/ios/install' ],
        wp8: [ './tasks/wp8/install' ],
        browser: [ './tasks/browser/open' ]
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
            platformsLib.isAvailableOnHost(platform)
        ]).spread(function (localSettings) {
            return runƒ({
                localSettings: localSettings,
                platform: platform,
                configuration: config,
                verbose: verbose
            });
        });
};

var runAll = function (config, verbose) {
    return tarifaFile.parse(pathHelper.root()).then(function (localSettings) {
        return localSettings.platforms.filter(platformsLib.isAvailableOnHostSync)
        .reduce(function(promise, platform) {
            return promise.then(function () {
                print.outline('Launch run for ' + platform + ' platform!');
                return runƒ({
                    localSettings: localSettings,
                    platform: platform,
                    configuration: config,
                    verbose: verbose
                });
            });
        }, Q());
    });
};

var action = function (argv) {
    var verbose = false,
    helpPath = path.join(__dirname, 'usage.txt');

    if(argsHelper.matchArgumentsCount(argv, [1,2]) &&
    argsHelper.checkValidOptions(argv, ['V', 'verbose'])) {
        if(argsHelper.matchOption(argv, 'V', 'verbose')) {
            verbose = true;
        }
        if(argv._[1])
            return run(argv._[1], argv._[0], verbose);
        else
            return runAll(argv._[0], verbose);
    }

    return fs.read(helpPath).then(print);
};

action.run = run;
action.runAll = runAll;
module.exports = action;
