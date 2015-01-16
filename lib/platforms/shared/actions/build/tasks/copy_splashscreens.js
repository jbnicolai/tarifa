var Q = require('q'),
    pathHelper = require('../../../../../helper/path'),
    print = require('../../../../../helper/print'),
    copySplashscreens = require('../../../../../cordova/splashscreen').copySplashscreens;

module.exports = function (msg) {
    return copySplashscreens(pathHelper.root(), msg.platform, msg.configuration)
        .then(function () {
            if(msg.verbose)
                print.success('copied splash screens for platform %s', msg.platform);
            return msg;
        }, function(err) {
           if(msg.verbose) print.error('Failed to copy splash screens: ' + err);
           return Q.reject(err);
        });
};
