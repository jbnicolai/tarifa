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
    platformsLib = require('../../lib/cordova/platforms'),
    copyDefaultIcons = require('../../lib/cordova/icon').copyDefault,
    createDefaultAssetsFolders = require('../../lib/cordova/assets').createFolders,
    copyDefaultSplash = require('../../lib/cordova/splashscreen').copyDefault;

function addAssets(platform, verbose) {
    var root = pathHelper.root(),
        type = platform.indexOf('@') > -1 ? platform.split('@')[0] : platform;
    return Q.all(createDefaultAssetsFolders(root, [type], 'default'))
        .then(function () { return copyDefaultIcons(root, [type], verbose); })
        .then(function () { return copyDefaultSplash(root, [type], verbose); });
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

function add(type, verbose) {
    return tarifaFile.addPlatform(pathHelper.root(), type)
        .then(function () { return platformsLib.add(pathHelper.root(), [type], verbose); })
        .then(function () { return addAssets(type, verbose); });
}

function remove(type, verbose) {
    return tarifaFile.removePlatform(pathHelper.root(), type)
        .then(function () { return platformsLib.remove(pathHelper.root(), [type], verbose); })
        .then(function () { return rmAssets(type, verbose); });
}

function platform (action, type, verbose) {
    var promises = [
        tarifaFile.parse(pathHelper.root()),
        platformsLib.isAvailableOnHost(type.indexOf('@') > -1 ? type.split('@')[0] : type)
    ];

    return Q.all(promises).spread(function (localSettings, available) {
        if(!available)
            return Q.reject(format("Can't %s %s!, %s is not available on your host", action, type, type));
        if(action === 'add')
            return add(platformsLib.extendPlatform(type), verbose);
        else
            return remove(type, verbose);
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
            return platform(argv._[0], argv._[1], verbose);
        }
    }

    return fs.read(helpPath).then(print);
}

action.platform = platform;
action.list = list;
module.exports = action;
