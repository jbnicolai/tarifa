var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
    tarifaFile = require('../../lib/tarifa-file'),
    pathHelper = require('../../lib/helper/path'),
    argsHelper = require('../../lib/helper/args'),
    platformsLib = require('../../lib/cordova/platforms'),
    print = require('../../lib/helper/print'),
    tasks = require('./tasks'),
    match = require('../../lib/helper/args').matchCmd;

function printHelp() {
    return fs.read(path.join(__dirname, 'usage.txt')).then(print);
}

function allPlatformsTask(taskƒ, config, argv, verbose) {
    return tarifaFile.parse(pathHelper.root()).then(function (localSettings) {
        return localSettings.platforms.filter(platformsLib.isAvailableOnHostSync)
        .reduce(function(promise, platform) {
            return promise.then(function () {
                print.outline('Run task for ' + platform + ' platform.');
                return tarifaFile.parse(pathHelper.root(), platform, config).then(function () {
                    return taskƒ({
                        localSettings: localSettings,
                        platform: platform,
                        config: config,
                        argv: argv,
                        verbose: verbose
                    });
                });
            });
        }, Q());
    });
}

function platformTask(taskƒ, config, platform, argv, verbose) {
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

function runTask(taskƒ, config, platform, argv, verbose) {
    if (platform) return platformTask(taskƒ, config, platform, argv, verbose);
    else return allPlatformsTask(taskƒ, config, argv, verbose);
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

    if(match(argv._, ['version', 'list', '+', '*']))
        return runTask(tasks.list, argv._[2], argv._[3], argv, verbose);

    if(match(argv._, ['version', 'upload', '+', '*']))
        return runTask(tasks.upload, argv._[2], argv._[3], argv, verbose);

    if(match(argv._, ['version', 'update', '+', '*']))
        return runTask(tasks.updateLast, argv._[2], argv._[3], argv, verbose);

    if(match(argv._, ['version', 'clean', '*']))
        return clean(argv._[2], verbose);

    return printHelp();
};

module.exports = action;
