/*
 * create assets folders structure
 */

var Q = require('q'),
    mkdirp = require('mkdirp'),
    fs = require('fs'),
    path = require('path'),
    settings = require('../../settings'),
    print = require('../../helper/print'),
    pathHelper = require('../../helper/path'),
    platformHelper = require('../../helper/platform'),
    copyDefaultIcons = require('../../cordova/icon').copyDefault,
    copyDefaultSplashscreens = require('../../cordova/splashscreen').copyDefault,
    generateDefaultIcons = require('../../cordova/icon').generate,
    generateDefaultSplashscreens = require('../../cordova/splashscreen').generate,
    createFolders = require('../../cordova/assets').createFolders;

function log(msg, verbose) { return function () { if(verbose) print.success(msg); }; }

function generateAssets(color, root, platforms, verbose) {
    return generateDefaultIcons(color, root, platforms, 'default', verbose)
        .then(function () {
            return generateDefaultSplashscreens(color, root, platforms, 'default', verbose);
        });
}

function copyDefaultAssets(root, platforms, verbose) {
    return copyDefaultIcons(root, platforms, verbose)
        .then(function () {
            return copyDefaultSplashscreens(root, platforms, verbose);
        });
}

module.exports = function (response) {

    var root = pathHelper.resolve(response.path),
        platforms = response.platforms.map(platformHelper.getName),
        printLog = log('assets folder created', verbose),
        imagesFolderExists = fs.existsSync(path.resolve(root, settings.images)),
        verbose = response.options.verbose;

    if (response.createProjectFromTarifaFile && !imagesFolderExists) {
        return Q.all(createFolders(root, platforms, 'default'))
            .then(printLog)
            .then(function () {
                return copyDefaultAssets(root, platforms, verbose);
            })
            .then(function () { return response; });
    } else if (response.createProjectFromTarifaFile && imagesFolderExists) {
        return Q(response);
    }

    return Q.all(createFolders(root, platforms, 'default'))
        .then(printLog)
        .then(function () {
            if(response.color) return generateAssets(response.color, root, platforms, verbose);
            else return copyDefaultAssets(root, platforms, verbose);
        }).then(function () { return response; });
};
