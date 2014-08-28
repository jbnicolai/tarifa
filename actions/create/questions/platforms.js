var host = require('os').platform(),
    settings = require('../../../lib/settings');

function availablePlatforms() {
    return settings.platforms.filter(function (p) {
        return p!=='web' && settings.os_platforms[p].indexOf(host) > -1;
    });
}

module.exports = {
    type : 'checkbox',
    name : 'platforms',
    choices : availablePlatforms().map(function (setting) {
        return { name : setting, value : setting };
    }),
    message : 'What are the supported platforms of your project (web is added by default)?'
};
