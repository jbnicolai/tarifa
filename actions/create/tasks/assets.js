/*
 * create assets folders structure
 */

var Q = require('q'),
    chalk = require('chalk'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    settings = require('../../../lib/settings'),
    copyDefaultIcons = require('../../../lib/cordova/icon').copyDefault,
    copyDefaultSplashscreens = require('../../../lib/cordova/splashscreen').copyDefault,
    generateDefaultIcons = require('../../../lib/cordova/icon').generate,
    generateDefaultSplashscreens = require('../../../lib/cordova/splashscreen').generate,
    createFolders = require('../../../lib/cordova/assets').createFolders;

function log(msg, verbose) { return function () { if(verbose) console.log(msg); }; }

function generateAssets(color, root, platforms, withSplash, verbose) {
    return generateDefaultIcons(color, root, platforms, 'default', verbose)
        .then(function () {
            if(withSplash) return generateDefaultSplashscreens(color, root, platforms, 'default', verbose);
            else return Q.resolve();
        });
}

function copyDefaultAssets(root, platforms, withSplash, verbose) {
    return copyDefaultIcons(root, platforms, verbose)
        .then(function () {
            if(withSplash) return copyDefaultSplashscreens(root, platforms, verbose);
            else return Q.resolve();
        });
}

module.exports = function (response) {
    var platforms = response.platforms.filter(function (platform) {
            return platform !== 'web';
        }),
        withSplash = response.plugins.indexOf('org.apache.cordova.splashscreen') > -1,
        root = response.path,
        verbose = response.options.verbose;

    return Q.all(createFolders(root, platforms, 'default', withSplash))
        .then(log(chalk.green('✔') + ' assets folder created', verbose))
        .then(function () {
            if(response.color) return generateAssets(response.color, root, platforms, withSplash, verbose);
            else return copyDefaultAssets(root, platforms, withSplash, verbose);
        }).then(function () { return response; });
};
