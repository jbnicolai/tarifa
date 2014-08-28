/*
 * add cordova platforms task
 */

var Q = require('q'),
    platformsLib = require('../../../lib/cordova/platforms');

module.exports = function (response) {
    var platforms = response.platforms.filter(function (platform) { return platform != 'web'; }),
        cwd = process.cwd();

    process.chdir(response.path);

    return platforms.length ? platformsLib.add(platforms, response.options.verbose).then(function() {
        process.chdir(cwd);
        return response;
    }) : Q.resolve(response);
};
