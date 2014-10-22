var Q = require('q'),
    host = require('os').platform(),
    platforms = require('../../../lib/cordova/platforms');

var question = function (response, verbose) {
    return platforms.installedPlatforms().then(function (choices) {
        return {
            type : 'checkbox',
            name : 'platforms',
            choices : choices,
            validate: function (answer) {
                return answer.length > 0 || 'one platform mandatory!';
            },
            message : 'Choose platforms (browser is added by default)?'
        };
    });
};

module.exports = question;
