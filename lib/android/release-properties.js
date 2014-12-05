/*
 * create a release.properties file, needed on the android platform to sign apk
 */

var path = require('path'),
    Q = require('q'),
    format = require('util').format,
    fs = require('q-io/fs'),
    path = require('path'),
    settings = require('../settings');

function releasePropertiesPath (root) {
    return path.join(
        root,
        settings.cordovaAppPath,
        'platforms',
        'android',
        'release.properties'
    );
}

module.exports.create = function (root, keystore, alias, storepass, keypass) {
    var tmpl = "keystore=%s\nkey.alias=%s\nkeystore.password=%s\nkey.password=%s";
    return fs.write(
        releasePropertiesPath(root),
        format(tmpl, path.resolve(keystore), alias, storepass, keypass)
   );
};

module.exports.remove = function (root) {
    var p = releasePropertiesPath(root);
    return fs.exists(p).then(function (exists) {
        if(exists) return fs.remove(p);
    });
};
