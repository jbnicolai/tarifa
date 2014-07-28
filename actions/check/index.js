var Q = require('q'),
    argsHelper = require('../../lib/args'),
    settings = require('../../lib/settings'),
    tarifaFile = require('../../lib/tarifa-file'),
    path = require('path'),
    fs = require('fs');

var tasks = {
    android : [
        require('./tasks/android/update_project')
    ],
    ios : [],
    web : []
};

var check = function (verbose) {
    var tarifaFilePath = path.join(process.cwd(), 'tarifa.json');
    return tarifaFile.parseConfig(tarifaFilePath).then(function (localSettings) {
        return settings.platforms.reduce(function (promiseP, platform) {
            return tasks[platform].reduce(function (promiseT, task) {
                return promiseT.then(task);
            }, promiseP);
        }, Q.resolve({
            settings: localSettings,
            verbose: verbose
        }));
    });
};

var action = function (argv) {
    var verbose = false;
    if(argsHelper.matchSingleOptions(argv, 'h', 'help')) {
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    if(argsHelper.matchSingleOptions(argv, 'V', 'verbose')) {
        verbose = true;
    } else if(argv._.length > 0) {
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    return check(verbose);
};

action.check = check;
module.exports = action;
