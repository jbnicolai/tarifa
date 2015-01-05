var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
    tarifaFile = require('../../lib/tarifa-file'),
    pathHelper = require('../../lib/helper/path'),
    argsHelper = require('../../lib/helper/args'),
    platformsLib = require('../../lib/cordova/platforms'),
    print = require('../../lib/helper/print'),
    tasks = require('./tasks'),
    argsHelper = require('../../lib/helper/args');

function printHelp() {
    return fs.read(path.join(__dirname, 'usage.txt')).then(print);
}

function platformTask(taskƒ, platform, config, argv, verbose) {
    return tarifaFile.parse(pathHelper.root(), platform, config)
    .then(function (localSettings) {
        return taskƒ({
            localSettings: localSettings,
            platform: platform,
            config: config,
            argv: argv,
            verbose: verbose
        });
    });
}

function multiplePlatformsTask(taskƒ, platforms, config, argv, verbose) {
    return tarifaFile.parse(pathHelper.root()).then(function (localSettings) {
        platforms = platforms || localSettings.platforms;
        return platforms.filter(platformsLib.isAvailableOnHostSync)
        .reduce(function(promise, platform) {
            return promise.then(function () {
                print.outline('Run task for ' + platform + ' platform.');
                return platformTask(taskƒ, platform, config, argv, verbose);
            });
        }, Q());
    });
}

function runTask(taskƒ, platform, config, argv, verbose) {
    if (platform === 'all')
        return multiplePlatformsTask(taskƒ, null, config, argv, verbose);
    else if (argsHelper.matchWildcard(platform))
        return multiplePlatformsTask(taskƒ, argsHelper.getFromWildcard(platform), config, argv, verbose);
    else
        return platformTask(taskƒ, platform, config, argv, verbose);
}

function clean(nbToKeep, verbose) {
    return tarifaFile.parse(pathHelper.root()).then(function (localSettings) {
        return tasks.clean({ localSettings: localSettings, verbose: verbose}, nbToKeep);
    });
}

var action = function (argv) {
    var verbose = false;

    if(argsHelper.matchOption(argv, 'V', 'verbose'))
        verbose = true;

    if(argsHelper.matchCmd(argv._, ['version', 'list', '+', '+']))
        return runTask(tasks.list, argv._[2], argv._[3] || 'default', argv, verbose);

    if(argsHelper.matchCmd(argv._, ['version', 'upload', '+', '+']))
        return runTask(tasks.upload, argv._[2], argv._[3] || 'default', argv, verbose);

    if(argsHelper.matchCmd(argv._, ['version', 'update', '+', '+']))
        return runTask(tasks.updateLast, argv._[2], argv._[3] || 'default', argv, verbose);

    if(argsHelper.matchCmd(argv._, ['version', 'clean', '*']))
        return clean(argv._[2], verbose);

    return printHelp();
};

module.exports = action;
