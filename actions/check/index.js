var Q = require('q'),
    os = require('os'),
    path = require('path'),
    fs = require('q-io/fs'),
    intersection = require('interset/intersection'),
    argsHelper = require('../../lib/helper/args'),
    print = require('../../lib/helper/print'),
    pathHelper = require('../../lib/helper/path'),
    tasksHelper = require('../../lib/helper/tasks'),
    settings = require('../../lib/settings'),
    tarifaFile = require('../../lib/tarifa-file'),
    builder = require('../../lib/builder'),
    listAvailableOnHost = require('../../lib/cordova/platforms').listAvailableOnHost,
    platformTasks = {};

settings.platforms.forEach(function (p) {
    var mod = path.resolve(__dirname, '../../lib/platforms', p, 'actions/check');
    platformTasks[p] = require(mod).tasks.map(function (p) {
        return path.resolve(__dirname, '../..', p);
    });
});

function loadUserTasks(platforms, localSettings) {
    var tasks = {},
        checkDef = localSettings.check;
    platforms.forEach(function (p) {
        tasks[p] = checkDef && checkDef[p]
            ? [require(pathHelper.resolve(checkDef[p]))] : [ ];
    });
    return tasks;
}

function launchTasks(message, platforms, tasks, userTasks) {
    return platforms.reduce(function (messg, platform) {
        return Q.when(messg, function (msg) {
            if (msg.verbose)
                print.success("start checking %s platform", platform);
            return tasksHelper.execSequence(tasks[platform].map(require))(msg);
        }).then(function (m) {
            if (m.verbose)
                print.success("start user check %s", platform);
            return tasksHelper.execSequence(userTasks[platform])(m);
        });
    }, message);
}

var check = function (verbose) {
    var cwd = process.cwd(),
        conf = [tarifaFile.parse(pathHelper.root()), listAvailableOnHost()];

    return Q.all(conf).spread(function (localSettings, platforms) {
        process.chdir(pathHelper.root());
        return launchTasks({
                settings: localSettings,
                verbose: verbose
            },
            intersection(platforms, localSettings.platforms),
            platformTasks,
            loadUserTasks(platforms, localSettings)
        );
    }).then(function (msg) {
        return builder.init(pathHelper.root(), msg.verbose);
    }).then(function (val) {
        process.chdir(cwd);
        return val;
    }, function (err) {
        process.chdir(cwd);
        return Q.reject(err);
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
