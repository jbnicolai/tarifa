/*
 * add cordova platforms task
 */

var Q = require('q'),
    platformsLib = require('../../../lib/cordova/platforms');

module.exports = function (response) {
    var cwd = process.cwd();

    if (!response.platforms.length) return response;

    process.chdir(response.path);

    return platformsLib.add(response.platforms, response.options.verbose).then(function() {
        process.chdir(cwd);
        return response;
    });
};
