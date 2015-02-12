var fs = require('q-io/fs'),
    path = require('path');

module.exports = function (cordovaAppRoot) {
    return fs.copy(
        path.resolve(__dirname, 'build.xcconfig'),
        path.resolve(cordovaAppRoot, 'platforms', 'ios', 'cordova', 'build.xcconfig')
    );
};
