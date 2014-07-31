var Q = require('q'),
	cordovaClean = require('../../../../lib/cordova/clean');

module.exports = function (msg) {
    return cordovaClean(['wp8'], msg.verbose).then(function () {
		return msg;    	
    });
};