var Q = require('q'),
    cordova = require('cordova'),
    opener = require("opener"),
    exec = require('child_process').exec,
    argsHelper = require('../../lib/args'),
    settings = require('../../lib/settings'),
    tarifaFile = require('../../lib/tarifa-file'),
    path = require('path'),
    fs = require('fs'),
    buildAction = require('../build'),
    installAndroidApp = require('./tasks/android/install'),
    openAndroidApp = require('./tasks/android/open'),
    openAndInstalliOSApp = require('./tasks/ios/install_and_open');

var run = function (platform, config, verbose) {
    var cwd = process.cwd();
    var tarifaFilePath = path.join(cwd, 'tarifa.json');

    return tarifaFile.parseFromFile(tarifaFilePath, platform, config).then(function (localSettings) {
        return buildAction.build(platform, config, verbose).then(function (msg) {
            switch(platform) {
                case 'android':
                    return installAndroidApp(localSettings, config, verbose).then(function () {
                        return openAndroidApp(localSettings, config, verbose);
                    });
                case 'ios':
                    return openAndInstalliOSApp(localSettings, config, verbose);
                case 'web':
                    opener(path.join(settings.project_output, 'index.html'));
                    return Q.resolve();
                default:
                     return Q.reject('platform unknown!');
            }
        });
    });
};

var action = function (argv) {
    var verbose = false;
    if(argsHelper.matchSingleOptions(argv, 'h', 'help')) {
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    if(argsHelper.matchSingleOptions(argv, 'V', 'verbose', [1,2])) {
        verbose = true;
    } else if(argv._.length != 1 && argv._.length != 2) {
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    return run(argv._[0], argv._[1] || 'default', verbose);
};

action.run = run;
module.exports = action;
