var Q = require('q'),
    pathHelper = require('../../../../../helper/path'),
    cordovaClean = require('../../../../../cordova/clean');

module.exports = function (msg) {
    return cordovaClean(pathHelper.root(), [msg.platform], msg.verbose).then(function () {
        return msg;
    });
};
