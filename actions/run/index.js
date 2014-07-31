var Q = require('q'),
    spinner = require("char-spinner"),
    cordova = require('cordova'),
    opener = require("opener"),
    exec = require('child_process').exec,
    argsHelper = require('../../lib/args'),
    settings = require('../../lib/settings'),
    tarifaFile = require('../../lib/tarifa-file'),
    isAvailableOnHost = require('../../lib/platforms').isAvailableOnHost,
    path = require('path'),
    fs = require('fs'),
    buildAction = require('../build'),
    installAndroidApp = require('./tasks/android/install'),
    openAndroidApp = require('./tasks/android/open'),
    installiOSApp = require('./tasks/ios/install'),
    installWP8App = require('./tasks/wp8/install'),
    askDevice = require('./ask_device');

var run = function (platform, config, verbose) {
    var cwd = process.cwd();
    var tarifaFilePath = path.join(cwd, 'tarifa.json');

    spinner();

    return tarifaFile.parseConfig(tarifaFilePath, platform, config)
        .then(function () { return isAvailableOnHost(platform); })
        .then(function (localSettings) {
            return buildAction.build(platform, config, verbose).then(function (msg) {
                switch(platform) {
                    case 'android':
                        return askDevice('android')
                            .then(function (device) { return installAndroidApp(localSettings, config, device.value, verbose); })
                            .then(function (device) { return openAndroidApp(localSettings, config, device.value, verbose); });
                    case 'ios':
                        return askDevice('ios')
                            .then(function(device) { return installiOSApp(localSettings, config, device.value, verbose); });
                    case 'web':
                        opener(path.join(settings.project_output, 'index.html'));
                        return Q.resolve();
                    case 'wp8':
                        return askDevice('wp8').then(function (device) { return installWP8App(device.index, verbose); });
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

    if(argsHelper.matchSingleOptions(argv, 'V', 'verbose')) {
        verbose = true;
    } else if(argv._.length != 1 && argv._.length != 2) {
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    return run(argv._[0], argv._[1] || 'default', verbose);
};

action.run = run;
module.exports = action;
