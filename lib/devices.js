var fs = require('fs'),
    format = require('util').format,
    path = require('path'),
    settings = require('./settings'),
    devices = {};

settings.platforms.forEach(function (platform) {
    var m = path.resolve(__dirname, 'platforms', platform, 'lib/device.js');
    if(fs.existsSync(m)) devices[platform] = require(m);
});

module.exports = devices;
