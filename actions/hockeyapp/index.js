var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
    intersection = require('interset/intersection'),
    tarifaFile = require('../../lib/tarifa-file'),
    pathHelper = require('../../lib/helper/path'),
    argsHelper = require('../../lib/helper/args'),
    platformHelper = require('../../lib/helper/platform'),
    platformsLib = require('../../lib/cordova/platforms'),
    print = require('../../lib/helper/print'),
    tasks = require('./tasks'),
    argsHelper = require('../../lib/helper/args');

function printHelp() {
    return fs.read(path.join(__dirname, 'usage.txt')).then(print);
}

function multiplePlatformsTask(task, platforms, config, argv, verbose) {
    var conf = [tarifaFile.parse(pathHelper.root()), platformsLib.listAvailableOnHost()];
    return Q.all(conf).spread(function (localSettings, availablePlatforms) {
        platforms = intersection(
            availablePlatforms,
            platforms || localSettings.platforms.map(platformHelper.getName)
        );
        return platforms.reduce(function(promise, platform) {
            return promise.then(function () {
                print.outline('Run task for %s platform', platform);
                return tarifaFile.parse(pathHelper.root(), platform, config)
                    .then(function (localSettings) {
                        return task({
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

function runTask(task, platform, config, argv, verbose) {
    if (platform === 'all')
        return multiplePlatformsTask(task, null, config, argv, verbose);
    else if (argsHelper.matchWildcard(platform))
        return multiplePlatformsTask(task, argsHelper.getFromWildcard(platform), config, argv, verbose);
    else
        return multiplePlatformsTask(task, [platform], config, argv, verbose);
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
