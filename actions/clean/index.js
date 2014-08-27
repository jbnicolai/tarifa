var Q = require('q'),
    spinner = require("char-spinner"),
    argsHelper = require('../../lib/helper/args'),
    pathHelper = require('../../lib/helper/path'),
    print = require('../../lib/helper/print'),
    tarifaFile = require('../../lib/tarifa-file'),
    isAvailableOnHost = require('../../lib/cordova/platforms').isAvailableOnHost,
    cordovaClean = require('../../lib/cordova/clean'),
    path = require('path'),
    fs = require('q-io/fs');

var clean = function (platform, verbose) {
    spinner();
    return tarifaFile.parse(pathHelper.root()).then(function (localSettings) {
        if(!isAvailableOnHost(platform))
            return Q.reject('platform not available in host!');
        if(platform && localSettings.platforms.indexOf(platform) < 0)
            return Q.reject('platform not available in project!');
        return cordovaClean(platform ? [platform] : localSettings.platforms, verbose);
    });
};

var action = function (argv) {
    var verbose = false,
        helpPath = path.join(__dirname, 'usage.txt');

    if(argsHelper.matchArgumentsCount(argv, [1])
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
