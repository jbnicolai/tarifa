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
    argsHelper = require('../../lib/helper/args'),

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

var runMultipleConfs = function(platform, configs, verbose) {
    return tarifaFile.parse(pathHelper.root(), platform).then(function (localSettings) {
        configs = configs || tarifaFile.getPlatformConfigs(localSettings, platform);
        return configs.reduce(function(promise, conf) {
            return promise.then(function () {
                print.outline('Run ' + conf + ' configuration!');
                return run(platform, conf, verbose);
            });
        }, Q());
    });
};

var runMultiplePlatforms = function (platforms, config, verbose) {
    return tarifaFile.parse(pathHelper.root()).then(function (localSettings) {
        platforms = platforms || localSettings.platforms;
        return platforms.filter(platformsLib.isAvailableOnHostSync)
        .reduce(function(promise, platform) {
            return promise.then(function () {
                print.outline('Launch run for ' + platform + ' platform!');
                if (config === 'all')
                    return runMultipleConfs(platform, null, verbose);
                else if (argsHelper.matchWildcard(config))
                    return runMultipleConfs(platform, argsHelper.getFromWildcard(config), verbose);
                else
                    return run(platform, config, verbose);
            });
        }, Q());
    });
};

var action = function (argv) {
    var verbose = false,
    helpPath = path.join(__dirname, 'usage.txt');

    if(argsHelper.matchOption(argv, 'V', 'verbose')) {
        verbose = true;
    }

    if(argsHelper.matchCmd(argv._, ['__all__', '*']))
        return runMultiplePlatforms(null, argv._[1] || 'default', verbose);

    if (argsHelper.matchCmd(argv._, ['__some__', '*']))
        return runMultiplePlatforms(argsHelper.getFromWildcard(argv._[0]), argv._[1] || 'default', verbose);

    if (argsHelper.matchCmd(argv._, ['+', '__all__']))
        return runMultipleConfs(argv._[0], null, verbose);

    if (argsHelper.matchCmd(argv._, ['+', '__some']))
        return runMultipleConfs(argv._[0], argsHelper.getFromWildcard(argv._[1], verbose));

    if(argsHelper.matchCmd(argv._, ['+', '*']))
        return run(argv._[1], argv._[0] || 'default', verbose);

    return fs.read(helpPath).then(print);
};

action.run = run;
action.runMultiplePlatforms = runMultiplePlatforms;
action.runƒ = runƒ;
module.exports = action;
