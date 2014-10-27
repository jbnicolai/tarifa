/*
 * add cordova platforms task
 */

var Q = require('q'),
    platformsLib = require('../../../lib/cordova/platforms');

module.exports = function (response) {
    if (!response.platforms.length) return response;
    return platformsLib.add(response.path, response.platforms, response.options.verbose).then(function() {
        return response;
    });
};
