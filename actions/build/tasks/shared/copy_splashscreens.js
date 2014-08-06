var Q = require('q'),
    path = require('path'),
    print = require('../../../../lib/helper/print'),
    copySplashscreens = require('../../../../lib/cordova/splashscreen').copySplashscreens;

module.exports = function (msg) {
    if(msg.platform === 'web') return Q.resolve(msg);
    if(msg.localSettings.plugins.indexOf('org.apache.cordova.splashscreen') < 0) return Q.resolve(msg);
    return copySplashscreens(msg.platform, msg.configuration)
        .then(function () {
            if(msg.verbose)
                print.success('copied splash screens for platform %s', msg.platform);
            return msg;
        });
};
