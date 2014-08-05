var Q = require('q'),
    path = require('path'),
    print = require('../../../../lib/helper/print'),
    copyIcons = require('../../../../lib/cordova/icon').copyIcons;

module.exports = function (msg) {
    if(msg.platform === 'web') return Q.resolve(msg);
    return copyIcons(msg.platform, msg.config)
        .then(function () {
            if(msg.verbose)
                print.success('copied icons for platform %s', msg.platform);
            return msg;
        });
};
