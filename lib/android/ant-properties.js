/*
 * create a ant.properties file, needed for the android platform to sign the apk
 */

var path = require('path'),
    Q = require('q'),
    format = require('util').format,
    fs = require('q-io/fs'),
    settings = require('../settings');

function antPropertiesPath (root) {
    return path.join(
        root,
        settings.cordovaAppPath,
        'platforms',
        'android',
        'ant.properties'
    );
}

module.exports.create = function (root, keystore, alias) {
    return fs.write(
        antPropertiesPath(root),
        format("key.store=%s\nkey.alias=%s", keystore, alias)
   );
};

module.exports.remove = function (root) {
    var p = antPropertiesPath(root);
    return fs.exists(p).then(function (exists) {
        if(exists) return fs.remove(p);
    });
};
