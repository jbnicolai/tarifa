var Q = require('q'),
    rimraf = require('rimraf'),
    spinner = require("char-spinner"),
    argsHelper = require('../../lib/helper/args'),
    pathHelper = require('../../lib/helper/path'),
    print = require('../../lib/helper/print'),
    tarifaFile = require('../../lib/tarifa-file'),
    isAvailableOnHostSync = require('../../lib/cordova/platforms').isAvailableOnHostSync,
    cordovaClean = require('../../lib/cordova/clean'),
    settings = require('../../lib/settings'),
    path = require('path'),
    fs = require('q-io/fs');

var tryRemoveWWW = function (verbose) {
    var defer = Q.defer();
    var www = path.join(pathHelper.app(), "www");
    rimraf(www, function (err) {
        if(err) {
            print.warning(err);
            print.warning("not able to remove www folder in cordova app!");
        }
        fs.makeDirectory(www).then(function() {
            defer.resolve();
        });
    });
    return defer.promise;
};

var tasks = {
    android : [ './tasks/android/clean_gradle_build' ],
    ios : [ ],
    wp8 : [ ],
    browser : [ ]
};

var runTasks = function (platforms, localSettings, verbose) {
    return function () {
        return platforms.reduce(function (promise, platform) {
            return promise.then(function (msg) {
                return tasks[platform].reduce(function (p, task) {
                    return p.then(require(task));
                }, Q(msg));
            });
        }, Q({
            settings: localSettings,
            verbose : verbose
        }));
    };
};

var clean = function (platform, verbose) {
    spinner();
    var cwd = process.cwd();
    process.chdir(pathHelper.root());
    return tarifaFile.parse(pathHelper.root()).then(function (localSettings) {
        if(platform && !isAvailableOnHostSync(platform))
            return Q.reject('platform not available in host!');
        if(platform && localSettings.platforms.indexOf(platform) < 0)
            return Q.reject('platform not available in project!');
        var availablePlatforms = localSettings.platforms.filter(isAvailableOnHostSync),
            platforms = platform ? [platform] : availablePlatforms;
        return tryRemoveWWW().then(function () {
            return cordovaClean(pathHelper.root(), platforms, verbose)
                .then(runTasks(platforms, localSettings, verbose));
        });
    }).then(function (msg) {
        process.chdir(cwd);
        return msg;
    }, function (err) {
        process.chdir(cwd);
        throw err;
    });
};

var action = function (argv) {
    var verbose = false,
        helpPath = path.join(__dirname, 'usage.txt');

    if(argsHelper.matchArgumentsCount(argv, [0, 1])
            && argsHelper.checkValidOptions(argv, ['V', 'verbose'])) {
        if(argsHelper.matchOption(argv, 'V', 'verbose')) {
            verbose = true;
        }
        return clean(argv._[0], verbose);
    }
    return fs.read(helpPath).then(print);
};

action.clean = clean;
module.exports = action;
