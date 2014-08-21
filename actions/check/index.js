var Q = require('q'),
    argsHelper = require('../../lib/helper/args'),
    print = require('../../lib/helper/print'),
    pathHelper = require('../../lib/helper/path'),
    settings = require('../../lib/settings'),
    tarifaFile = require('../../lib/tarifa-file'),
    builder = require('../../lib/builder'),
    path = require('path'),
    fs = require('q-io/fs');

var tasks = {
    android : [
        require('./tasks/android/update_project')
    ],
    ios : [],
    wp8 : [],
    web : [],
    windows8: []
};

var check = function (verbose) {
    return tarifaFile.parseConfig(pathHelper.current()).then(function (localSettings) {
        return settings.platforms.reduce(function (promiseP, platform) {
            return tasks[platform].reduce(function (promiseT, task) {
                return promiseT.then(task);
            }, promiseP);
        }, Q.resolve({
            settings: localSettings,
            verbose: verbose
        }));
    }).then(function (msg) {
        return builder.init(process.cwd(), msg.verbose);
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
