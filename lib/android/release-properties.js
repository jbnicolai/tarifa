/*
 * create a release.properties file, needed on the android platform to sign apk
 */

var path = require('path'),
    os = require('os'),
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
    var tmpl = "keystore=%s%skey.alias=%s%skeystore.password=%s%skey.password=%s%s";
    console.log(path.normalize(keystore));
    console.log(format(tmpl, path.normalize(keystore), os.EOL, alias, os.EOL, storepass, os.EOL, keypass, os.EOL));
    return fs.write(
        releasePropertiesPath(root),
        format(tmpl, path.normalize(keystore), os.EOL, alias, os.EOL, storepass, os.EOL, keypass, os.EOL)
   );
};

module.exports.remove = function (root) {
    var p = releasePropertiesPath(root);
    return fs.exists(p).then(function (exists) {
        if(exists) return fs.remove(p);
    });
};
