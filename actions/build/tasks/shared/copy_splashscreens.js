var Q = require('q'),
    chalk = require('chalk'),
    path = require('path'),
    copySplashscreens = require('../../../../lib/cordova/splashscreen').copySplashscreens;

module.exports = function (msg) {
    if(msg.platform === 'web') return Q.resolve(msg);
    if(msg.settings.plugins.indexOf('org.apache.cordova.splashscreen') < 0) return Q.resolve(msg);
    return copySplashscreens(msg.platform, msg.config)
        .then(function () {
            if(msg.verbose)
                console.log(chalk.green('✔') + ' copied splash screens for platform ' + msg.platform);
            return msg;
        });
};
