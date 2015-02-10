var Q = require('q'),
    rimraf = require('rimraf'),
    format = require('util').format,
    fs = require('q-io/fs');
    path = require('path'),
    chalk = require('chalk'),
    argsHelper = require('../../lib/helper/args'),
    tarifaFile = require('../../lib/tarifa-file'),
    settings = require('../../lib/settings'),
    pathHelper = require('../../lib/helper/path'),
    print = require('../../lib/helper/print'),
    platformHelper = require('../../lib/helper/platform'),
    platformsLib = require('../../lib/cordova/platforms'),
    copyDefaultIcons = require('../../lib/cordova/icon').copyDefault,
    createDefaultAssetsFolders = require('../../lib/cordova/assets').createFolders,
    copyDefaultSplash = require('../../lib/cordova/splashscreen').copyDefault;

function addAssets(platform, verbose) {
    var root = pathHelper.root(),
        platformName = platformHelper.getName(platform);
    return Q.all(createDefaultAssetsFolders(root, [platformName], 'default'))
        .then(function () { return copyDefaultIcons(root, [platformName], verbose); })
        .then(function () { return copyDefaultSplash(root, [platformName], verbose); });
}

function rmAssets(platform, verbose) {
    var defer = Q.defer();
    var platformAssetsPath = path.join(pathHelper.root(), settings.images, platform);
    rimraf(platformAssetsPath, function (err) {
        if(err) print.warning('%s assets folder could not be removed: %s', platform, err);
        if(!err && verbose) print.success('removed asset folder');
        defer.resolve();
    });
    return defer.promise;
}

function add(platform, verbose) {
    return tarifaFile.addPlatform(pathHelper.root(), platform)
        .then(function () { return platformsLib.add(pathHelper.root(), [platform], verbose); })
        .then(function () { return addAssets(platform, verbose); });
}

function remove(platform, verbose) {
    return tarifaFile.removePlatform(pathHelper.root(), platform)
        .then(function () { return platformsLib.remove(pathHelper.root(), [platform], verbose); })
        .then(function () { return rmAssets(platform, verbose); });
}

function platformAction (action, platform, verbose) {
    var promises = [
        tarifaFile.parse(pathHelper.root()),
        platformsLib.isAvailableOnHost(platformHelper.getName(platform))
    ];

    return Q.all(promises).spread(function (localSettings, available) {
        if(!available)
            return Q.reject(format("Can't %s %s!, %s is not available on your host", action, platform, platform));
        if(action === 'add')
            return add(platformsLib.extendPlatform(platform), verbose);
        else
            return remove(platform, verbose);
    });
}

function list(verbose) {
    return tarifaFile.parse(pathHelper.root()).then(function () {
        return platformsLib.list(pathHelper.root(), verbose);
    });
}

function info(verbose) {
    print.outline('Supported cordova platforms:\n');
    platformsLib.info().forEach(function (platform) {
        print('  %s current version %s\n  supported versions: %s\n', platform.name, platform.version, platform.versions.join(', '));
    });
    return Q();
}

function action (argv) {
    var verbose = false,
        actions = ['add', 'remove'],
        helpPath = path.join(__dirname, 'usage.txt');

    if(argsHelper.checkValidOptions(argv, ['V', 'verbose'])) {
        if(argsHelper.matchOption(argv, 'V', 'verbose')) {
            verbose = true;
        }
        if(argv._[0] === 'list' && argsHelper.matchArgumentsCount(argv, [1])){
            return list(true);
        }
        if(argv._[0] === 'info' && argsHelper.matchArgumentsCount(argv, [1])){
            return info(verbose);
        }
        if(actions.indexOf(argv._[0]) > -1
            && argsHelper.matchArgumentsCount(argv, [2])) {
            return platformAction(argv._[0], argv._[1], verbose);
        }
    }

    return fs.read(helpPath).then(print);
}

action.platform = platformAction;
action.list = list;
module.exports = action;
