/*
 * add cordova platforms task
 */

var Q = require('q'),
    platformsLib = require('../../../lib/cordova/platforms');

module.exports = function (response) {
    var platforms = response.platforms.filter(function (platform) { return platform != 'web'; }),
        cwd = process.cwd();

    if (!platforms.length) return response;

    process.chdir(response.path);

    return platformsLib.add(platforms, response.options.verbose).then(function() {
        process.chdir(cwd);
        return response;
    });
};
