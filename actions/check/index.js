var Q = require('q'),
    os = require('os'),
    argsHelper = require('../../lib/helper/args'),
    print = require('../../lib/helper/print'),
    pathHelper = require('../../lib/helper/path'),
    settings = require('../../lib/settings'),
    tarifaFile = require('../../lib/tarifa-file'),
    builder = require('../../lib/builder'),
    installedPlatforms = require('../../lib/cordova/platforms').installedPlatforms,
    isAvailableOnHost = require('../../lib/cordova/platforms').isAvailableOnHost,
    path = require('path'),
    fs = require('q-io/fs');

var tasks = {
    android : [
        require('./tasks/android/update_project')
    ],
    ios : [],
    wp8 : [],
    browser : []
};

function getUserTasks (availablePlatforms, localSettings) {
    var usertasks = {};
    availablePlatforms.forEach(function (p) {
        usertasks[p] = localSettings.check && localSettings.check[p]
            ? [require(path.resolve(localSettings.check[p]))] : [];
    });
    return usertasks;
}

var check = function (verbose) {
    var cwd = process.cwd();
    process.chdir(pathHelper.root());
    return tarifaFile.parse(pathHelper.root()).then(function (localSettings) {
        return installedPlatforms().then(function (platforms) {
            var platformNames = platforms.filter(function (p) {
                return !p.disabled;
            }).map(function (p) { return p.name; });
            var userTasks = getUserTasks(platformNames.filter(isAvailableOnHost), localSettings);
            return localSettings.platforms.reduce(function (promiseP, platform) {
                if(platformNames.indexOf(platform) < 0) {
                    if(settings.os_platforms[platform].indexOf(os.platform()) > -1)
                        print.error("platform %s is not installed on os, skipping checks...", platform);
                    return promiseP;
                }
                if (verbose) print.success("start checking %s platform", platform);
                return tasks[platform].reduce(function (promiseT, task) {
                    return promiseT.then(task);
                }, promiseP).then(function (msg) {
                    if (verbose) print.success("start user check %s", platform);
                    return userTasks[platform].reduce(function (promiseUT, usertask) {
                        return promiseUT.then(usertask);
                    }, Q(msg));
                });
            }, Q.resolve({
                settings: localSettings,
                verbose: verbose
            }));
        });
    }).then(function (msg) {
        return builder.init(pathHelper.root(), msg.verbose);
    }).then(function (val) {
        process.chdir(cwd);
        return val;
    }, function (err) {
        process.chdir(cwd);
        throw err;
    });
};

var action = function (argv) {
    var verbose = false,
        helpPath = path.join(__dirname, 'usage.txt');

    if(argsHelper.matchArgumentsCount(argv, [0])
            && argsHelper.checkValidOptions(argv, ['V', 'verbose'])) {
        if(argsHelper.matchOption(argv, 'V', 'verbose')) {
            verbose = true;
        }
        return check(verbose);
    }

    return fs.read(helpPath).then(print);
};

action.check = check;
module.exports = action;
