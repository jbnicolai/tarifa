/*
 * add cordova platforms task
 */

var platformsTool = require('../../../lib/platforms');

module.exports = function (response) {
    var platforms = response.platforms.filter(function (platform) { return platform != 'web'; });

    process.chdir(response.path);

    return platformsTool.add(platforms, response.options.verbose).then(function() {
        return response;
    });
};
