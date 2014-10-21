var Q = require('q'),
    path = require('path'),
    print = require('../../../../lib/helper/print'),
    copySplashscreens = require('../../../../lib/cordova/splashscreen').copySplashscreens;

module.exports = function (msg) {
    return copySplashscreens(msg.platform, msg.configuration)
        .then(function () {
            if(msg.verbose)
                print.success('copied splash screens for platform %s', msg.platform);
            return msg;
        }, function(err) {
           if(msg.verbose) print.error('Failed to copy splash screens: ' + err);
           return Q.reject(err);
        });
};
