/*
 * add cordova platforms task
 */

var platformsLib = require('../../../lib/platforms');

module.exports = function (response) {
    var platforms = response.platforms.filter(function (platform) { return platform != 'web'; });
    var cwd = process.cwd();

    process.chdir(response.path);

    return platformsLib.add(platforms, response.options.verbose).then(function() {
        process.chdir(cwd);
        return response;
    });
};
