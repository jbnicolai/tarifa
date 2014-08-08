var Q = require('q'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    tarifaFile = require('../../lib/tarifa-file'),
    settings = require('../../lib/settings'),
    colorHelper = require('../../lib/helper/color'),
    generateIcons = require('../../lib/cordova/icon').generate,
    generateSplashscreens = require('../../lib/cordova/splashscreen').generate,
    createFolders = require('../../lib/cordova/assets').createFolders;

module.exports.generateIcons = function (args, verbose) {
    var cwd = process.cwd(),
        color = args[0],
        config = args[1];

    if(!colorHelper.validate(color)) return Q.reject('invalid color!');

    return tarifaFile.parseConfig(path.join(cwd, 'tarifa.json')).then(function (localSettings) {
        var platforms = localSettings.platforms.filter(function (platform) {
            return platform !== 'web';
        });
        return Q.all(createFolders(cwd, platforms, config)).then(function () {
            return generateIcons(color, cwd, platforms, config, verbose);
        });
    });
};

module.exports.generateSplashscreens = function (args, verbose) {
    var cwd = process.cwd(),
        color = args[0],
        config = args[1];

    if(!colorHelper.validate(color)) return Q.reject('invalid color!');

    return tarifaFile.parseConfig(path.join(cwd, 'tarifa.json')).then(function (localSettings) {
        var platforms = localSettings.platforms.filter(function (platform) {
            return platform !== 'web';
        });
        return Q.all(createFolders(cwd, platforms, config, true)).then(function () {
            return generateSplashscreens(color, cwd, platforms, config, verbose);
        });
    });
};
