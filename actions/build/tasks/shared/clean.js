var Q = require('q'),
    cordovaClean = require('../../../../lib/cordova/clean');

module.exports = function (msg) {
    return cordovaClean([msg.platform], msg.verbose).then(function () {
        return msg;
    });
};
