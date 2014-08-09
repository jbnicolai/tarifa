var Q = require('q'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    tarifaFile = require('../../lib/tarifa-file'),
    tarifaPath = require('../../lib/helper/path'),
    settings = require('../../lib/settings'),
    colorHelper = require('../../lib/helper/color'),
    generateIcons = require('../../lib/cordova/icon').generate,
    generateSplashscreens = require('../../lib/cordova/splashscreen').generate,
    createFolders = require('../../lib/cordova/assets').createFolders;

function generate(color, config, f, verbose) {
    var cwd = process.cwd();
    if(!colorHelper.validate(color)) return Q.reject('invalid color!');

    return tarifaFile.parseConfig(tarifaPath.current()).then(function (localSettings) {
        var platforms = localSettings.platforms.filter(function (platform) {
            return platform !== 'web';
        });
        return Q.all(createFolders(cwd, platforms, config)).then(function () {
            return f(color, cwd, platforms, config, verbose);
        });
    });
}

module.exports.generateIcons = function (color, config, verbose) {
    return generate(color, config, generateIcons, verbose);
};

module.exports.generateSplashscreens = function (color, config, verbose) {
    return generate(color, config, generateSplashscreens, verbose);
};
