var path = require('path'),
    cordova = require('cordova'),
    Q = require('q'),
    settings = require('../settings');

// TODO
function validateURIS(uri) {
    return true;
}

function change(cmd, root, uris) {
    var cordova_path = path.join(root, settings.cordovaAppPath),
        cwd = process.cwd(),
        defer = Q.defer();

    if(!validateURIS(uris)) return Q.reject("invalid plugins uris");

    process.chdir(cordova_path);

    cordova.plugin(cmd, uris, function (err) {
        process.chdir(cwd);
        if(err) {
            defer.reject(err);
            return;
        }
        defer.resolve();
    });
    return defer.promise;
}

module.exports.add = function (root, uris) {
    return change('add', root, uris);
};

module.exports.remove = function (root, names) {
    return change('remove', root, names);
};

// TODO
module.exports.list = function (root) {
    return Q.resolve([]);
};
