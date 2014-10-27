var Q = require('q'),
    pathHelper = require('../../../../lib/helper/path'),
    print = require('../../../../lib/helper/print'),
    copyIcons = require('../../../../lib/cordova/icon').copyIcons;

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
