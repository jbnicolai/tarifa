var fs = require('q-io/fs'),
    path = require('path');

module.exports = function (cordovaAppRoot) {
    var gradleFile = path.resolve(cordovaAppRoot, 'platforms', 'android', 'build.gradle');
    return fs.remove(gradleFile).then(function () {
        return fs.copy(path.resolve(__dirname, 'build.gradle'), gradleFile);
    });
};
