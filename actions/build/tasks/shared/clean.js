var Q = require('q'),
    pathHelper = require('../../../../lib/helper/path'),
    cordovaClean = require('../../../../lib/cordova/clean');

module.exports = function (msg) {
    return cordovaClean(pathHelper.root(), [msg.platform], msg.verbose).then(function () {
        return msg;
    });
};
