var Q = require('q'),
    chalk = require('chalk'),
    path = require('path'),
    copyIcons = require('../../../lib/cordova/icon').copyIcons;

module.exports = function (msg) {
    if(msg.platform === 'web') return Q.resolve(msg);
    return copyIcons(msg.platform, msg.config)
        .then(function () {
            if(msg.verbose)
                console.log(chalk.green('✔') + ' copied icons for platform ' + msg.platform);
            return msg;
        });
};
