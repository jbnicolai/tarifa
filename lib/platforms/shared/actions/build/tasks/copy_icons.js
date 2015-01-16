var Q = require('q'),
    pathHelper = require('../../../../../helper/path'),
    print = require('../../../../../helper/print'),
    copyIcons = require('../../../../../cordova/icon').copyIcons;

module.exports = function (msg) {
    return copyIcons(pathHelper.root(), msg.platform, msg.configuration)
    .then(function () {
        if(msg.verbose)
            print.success('copied icons for platform %s', msg.platform);
        return msg;
    }, function(err) {
        if(msg.verbose) print.error('Failed to copy icons: ' + err);
        return Q.reject(err);
    });
};
