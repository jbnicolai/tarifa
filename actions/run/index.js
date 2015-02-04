var Q = require('q'),
    spinner = require("char-spinner"),
    cordova = require('cordova-lib/src/cordova/cordova'),
    exec = require('child_process').exec,
    path = require('path'),
    fs = require('q-io/fs'),
    intersection = require("interset/intersection"),
    argsHelper = require('../../lib/helper/args'),
    print = require('../../lib/helper/print'),
    settings = require('../../lib/settings'),
    tarifaFile = require('../../lib/tarifa-file'),
    pathHelper = require('../../lib/helper/path'),
    tasksHelper = require('../../lib/helper/tasks'),
    platformsLib = require('../../lib/cordova/platforms'),
    buildAction = require('../build'),
    askDevice = require('./ask_device'),
    argsHelper = require('../../lib/helper/args'),
    platformTasks = tasksHelper.load(settings.platforms, 'run', 'tasks');

var runƒ = function (conf) {
    var tasks = platformTasks[conf.platform].map(require);
    return buildAction.buildƒ(conf).then(askDevice)
        .then(tasksHelper.execSequence(tasks));
};

var run = function (platform, config, localSettings, cleanResources, verbose) {
    print.outline('Launch run for %s platform and configuration %s !', platform, config);
    spinner();
    return platformsLib.isAvailableOnHost(platform)
        .then(function () {
            return runƒ({
                localSettings: localSettings,
                platform: platform,
                configuration: config,
                cleanResources: cleanResources,
                verbose: verbose
            });
    });
};

var runMultipleConfs = function(platform, configs, localSettings, cleanResources, verbose) {
    configs = configs || tarifaFile.getPlatformConfigs(localSettings, platform);
    return tarifaFile.checkConfigurations(configs, platform, localSettings).then(function () {
        return configs.reduce(function(promise, conf) {
            return promise.then(function () {
                return run(platform, conf, localSettings, cleanResources, verbose);
            });
        }, Q());
    });
};

var runMultiplePlatforms = function (platforms, config, cleanResources, verbose) {
    return tarifaFile.parse(pathHelper.root()).then(function (localSettings) {
        platforms = platforms || localSettings.platforms;
        return tarifaFile.checkPlatforms(platforms, localSettings).then(function (availablePlatforms) {
            return intersection(platforms, availablePlatforms).reduce(function(promise, platform) {
                return promise.then(function () {
                    if (config === 'all') {
                        config = null;
                    } else if (argsHelper.matchWildcard(config)) {
                        config = argsHelper.getFromWildcard(config);
                    }
                    return runMultipleConfs(platform, config, localSettings, cleanResources, verbose);
                });
            }, Q());
        });
    });
};

var action = function (argv) {
    var verbose = false,
    cleanResources = false,
    helpPath = path.join(__dirname, 'usage.txt');

    if(argsHelper.matchOption(argv, 'V', 'verbose'))
        verbose = true;

    if (argsHelper.matchOption(argv, null, 'clean-resources'))
        cleanResources = true;

    if(argsHelper.matchCmd(argv._, ['__all__', '*']))
        return runMultiplePlatforms(null, argv._[1] || 'default', cleanResources, verbose);

    if (argsHelper.matchCmd(argv._, ['__some__', '*']))
        return runMultiplePlatforms(argsHelper.getFromWildcard(argv._[0]), argv._[1] || 'default', cleanResources, verbose);

    return fs.read(helpPath).then(print);
};

action.run = run;
action.runMultiplePlatforms = runMultiplePlatforms;
action.runƒ = runƒ;
module.exports = action;
