var hostOS = require('os').platform(),
    settings = require('../../../lib/settings');

function availablePlatforms() {
    return settings.platforms.filter(function (platform) {
        return settings.os_platforms[platform].indexOf(hostOS) > -1;
    });
}

module.exports = {
    type : 'checkbox',
    name : 'platforms',
    validate : function (val) { return val.length > 1 || "More than one platform is mandatory!"; },
    choices : availablePlatforms().map(function (setting) {
        return { name : setting, value : setting };
    }),
    message : 'What are the supported platform of your project?'
};
