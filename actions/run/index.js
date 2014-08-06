var Q = require('q'),
    spinner = require("char-spinner"),
    cordova = require('cordova'),
    exec = require('child_process').exec,
    path = require('path'),
    fs = require('fs'),
    argsHelper = require('../../lib/helper/args'),
    print = require('../../lib/helper/print'),
    settings = require('../../lib/settings'),
    tarifaFile = require('../../lib/tarifa-file'),
    isAvailableOnHost = require('../../lib/cordova/platforms').isAvailableOnHost,
    buildAction = require('../build'),
    installAndroidApp = require('./tasks/android/install'),
    openAndroidApp = require('./tasks/android/open'),
    installiOSApp = require('./tasks/ios/install'),
    installWP8App = require('./tasks/wp8/install'),
    openWebApp = require('./tasks/web/open'),
    askDevice = require('./ask_device');

var run = function (platform, config, verbose) {
    var cwd = process.cwd();
    var tarifaFilePath = path.join(cwd, 'tarifa.json');

    spinner();

    return tarifaFile.parseConfig(tarifaFilePath, platform, config)
        .then(function (localSettings) {
            return isAvailableOnHost(platform).then(function () {
                return localSettings;
            });
        }).then(function (localSettings) {
            return buildAction.build(platform, config, verbose).then(function (msg) {
                switch(platform) {
                    case 'android':
                        return askDevice('android')
                            .then(function (device) { return installAndroidApp(localSettings, config, device, verbose); })
                            .then(function (device) { return openAndroidApp(localSettings, config, device, verbose); });
                    case 'ios':
                        return askDevice('ios')
                            .then(function(device) { return installiOSApp(localSettings, config, device, verbose); });
                    case 'web':
                        return openWebApp(localSettings, config, verbose);
                    case 'wp8':
                        return askDevice('wp8').then(function (device) { return installWP8App(device, verbose); });
                    default:
                         return Q.reject('platform unknown!');
                }
            });
        });
};

var action = function (argv) {
    var verbose = false;
    if(argsHelper.matchSingleOption(argv, 'h', 'help')) {
        print(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    if(argsHelper.matchSingleOption(argv, 'V', 'verbose')) {
        verbose = true;
    } else if(argv._.length != 1 && argv._.length != 2) {
        print(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    return run(argv._[0], argv._[1] || 'default', verbose);
};

action.run = run;
module.exports = action;
