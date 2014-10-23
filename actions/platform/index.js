var Q = require('q'),
    rimraf = require('rimraf'),
    format = require('util').format,
    argsHelper = require('../../lib/helper/args'),
    tarifaFile = require('../../lib/tarifa-file'),
    path = require('path'),
    chalk = require('chalk'),
    settings = require('../../lib/settings'),
    pathHelper = require('../../lib/helper/path'),
    print = require('../../lib/helper/print'),
    platformsLib = require('../../lib/cordova/platforms'),
    copyDefaultIcons = require('../../lib/cordova/icon').copyDefault,
    createDefaultAssetsFolders = require('../../lib/cordova/assets').createFolders,
    copyDefaultSplash = require('../../lib/cordova/splashscreen').copyDefault,
    fs = require('q-io/fs');

function addAssets(platform, verbose) {
    var cwd = process.cwd();
    return Q.all(createDefaultAssetsFolders(cwd, [platform], 'default'))
        .then(function () { return copyDefaultIcons(cwd, [platform], verbose); })
        .then(function () { return copyDefaultSplash(cwd, [platform], verbose); });
}

function rmAssets(platform, verbose) {
    var defer = Q.defer();
    var platformAssetsPath = path.join(process.cwd(), settings.images, platform);
    rimraf(platformAssetsPath, function (err) {
        if(err) defer.reject(err);
        if(verbose) print.success('removed asset folder');
        defer.resolve();
    });
    return defer.promise;
}

function add(type, verbose) {
    return tarifaFile.addPlatform(pathHelper.root(), type)
        .then(function () { return platformsLib.add([type], verbose); })
        .then(function () { return addAssets(type, verbose); });
}

function remove(type, verbose) {
    return tarifaFile.removePlatform(pathHelper.root(), type)
        .then(function () { return platformsLib.remove([type], verbose); })
        .then(function () { return rmAssets(type, verbose); });
}

function platform (action, type, verbose) {
    var promises = [
        tarifaFile.parse(pathHelper.root()),
        platformsLib.isAvailableOnHost(type.indexOf('@') > -1 ? type.split('@')[0] : type)
    ];

    return Q.all(promises).spread(function (localSettings, available) {
        if(!available) return Q.reject(format("Can't %s %s!, %s is not available on your host", action, type, type));
        if(action === 'add') return add(type, verbose);
        else return remove(type, verbose);
    });
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
            return tarifaFile.parse(pathHelper.root()).then(function () {
                return platformsLib.list(true);
            });
        }
        if(actions.indexOf(argv._[0]) > -1
            && argsHelper.matchArgumentsCount(argv, [2])) {
            return platform(argv._[0], argv._[1], verbose);
        }
    }

    return fs.read(helpPath).then(print);
}

action.platform = platform;
action.list = platformsLib.list;
module.exports = action;
