var Q = require('q'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    tarifaFile = require('../../lib/tarifa-file'),
    settings = require('../../lib/settings'),
    generateIcons = require('../../lib/cordova/icon').generate,
    generateSplashscreens = require('../../lib/cordova/splashscreen').generate,
    createFolders = require('../../lib/cordova/assets').createFolders;

// TODO
// we support hexadecimal format + all formats supported by imagemagick
function validColor(color) { return true; }

module.exports.generateIcons = function (args, verbose) {
    var cwd = process.cwd(),
        color = args[0],
        config = args[1];

    if(!validColor(color)) return Q.reject('invalid color!');

    return tarifaFile.parseConfig(path.join(cwd, 'tarifa.json')).then(function (localSettings) {
        return Q.all(createFolders(cwd, localSettings.platforms, config)).then(function () {
            return generateIcons(color, cwd, localSettings.platforms, config, verbose);
        });
    });
};

module.exports.generateSplashscreens = function (args, verbose) {
    var cwd = process.cwd(),
        color = args[0],
        config = args[1];

    if(!validColor(color)) return Q.reject('invalid color!');

    return tarifaFile.parseConfig(path.join(cwd, 'tarifa.json')).then(function (localSettings) {
        var platforms = localSettings.platforms.filter(function (platform) {
            return platform !== 'web';
        });
        return Q.all(createFolders(cwd, platforms, config, true)).then(function () {
            return generateSplashscreens(color, cwd, platforms, config, verbose);
        });
    });
};
