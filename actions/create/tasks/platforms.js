/*
 * add cordova platforms task
 */

var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
    settings = require('../../../lib/settings'),
    pathHelper = require('../../../lib/helper/path'),
    platformsLib = require('../../../lib/cordova/platforms');

module.exports = function (response) {
    if (!response.platforms.length) return response;

    return platformsLib.add(
        pathHelper.resolve(response.path),
        response.platforms,
        response.options.verbose
    ).then(function() { return response; });
};
