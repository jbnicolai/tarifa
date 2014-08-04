var Q = require('q'),
    chalk = require('chalk'),
    rimraf = require('rimraf'),
    argsHelper = require('../../lib/args'),
    tarifaFile = require('../../lib/tarifa-file'),
    path = require('path'),
    settings = require('../../lib/settings'),
    tarifaPath = require('../../lib/helper/path'),
    platformsLib = require('../../lib/cordova/platforms'),
    copyDefaultIcons = require('../../lib/cordova/icon').copyDefault,
    createDefaultAssetsFolders = require('../../lib/cordova/assets').createFolders,
    copyDefaultSplash = require('../../lib/cordova/splashscreen').copyDefault,
    fs = require('fs');

function addAssets(platform, splash, verbose) {
    var cwd = process.cwd();
    return Q.all(createDefaultAssetsFolders(cwd, [platform], 'default', splash))
        .then(function () { return copyDefaultIcons(cwd, [platform], verbose); })
        .then(function () {
            if(splash) return copyDefaultSplash(cwd, [platform], verbose);
            else return Q.resolve();
        });
}

function rmAssets(platform, verbose) {
    var defer = Q.defer();
    var platformAssetsPath = path.join(process.cwd(), settings.images, platform);
    rimraf(platformAssetsPath, function (err) {
        if(err) defer.reject(err);
        if(verbose) console.log(chalk.green('✔') + ' removed asset folder');
        defer.resolve();
    });
    return defer.promise;
}

function add(type, splash, verbose) {
    return platformsLib.add([type], verbose)
        .then(function () {
            return tarifaFile.addPlatform(tarifaPath.current(), type);
        }).then(function () { return addAssets(type, splash, verbose); });
}

function remove(type, verbose) {
    return platformsLib.remove([type], verbose)
        .then(function () {
            return tarifaFile.removePlatform(tarifaPath.current(), type);
        }).then(function () { return rmAssets(type, verbose); });
}

function list(type, verbose) { return platformsLib.list(true); }

function platform (action, type, verbose) {
    return tarifaFile.parseConfig(tarifaPath.current())
        .then(function (localSettings) {
            if(type) {
                return platformsLib.isAvailableOnHost(type)
                    .then(function () { return localSettings; });
            }
            return localSettings;
        })
        .then(function (localSettings) {
            var hasSplash = localSettings.plugins.indexOf("org.apache.cordova.splashscreen") > -1;
            switch(action) {
                case 'add':
                    return add(type, hasSplash, verbose);
                case 'remove':
                    return remove(type, verbose);
                case 'list':
                    return list(true);
                default:
                    return list(true);
            }
        });
}

function action (argv) {
    var verbose = false;
    var actions = ['add', 'remove', 'list'];
    var validAction = actions.filter(function (a) {
            return a === argv._[0];
        }).length === 1;

    if(argsHelper.matchSingleOptions(argv, 'h', 'help')) {
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    if(argsHelper.matchSingleOptions(argv, 'V', 'verbose')) {
        verbose = true;
    } else if(argv._.length != 1 && argv._.length != 2) {
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    if(!validAction) return Q.reject('action unknown!');
    if(argv._[0] === undefined || argv._[0] === 'list')
        return platform(argv._[0], null, verbose);
    if(argv._[1] === undefined) return Q.reject('platform name unknown!');

    return platform(argv._[0], argv._[1], verbose);
}

action.platform = platform;

module.exports = action;
