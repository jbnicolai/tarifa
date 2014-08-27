var path = require('path'),
    fs = require('fs'),
    cordova = require('cordova'),
    findPlugins = require('cordova/src/util').findPlugins,
    Q = require('q'),
    settings = require('../settings'),
    tarifaFile = require('../tarifa-file');

function list(root) {
    return Q.resolve(findPlugins(path.join(root, settings.cordovaAppPath, 'plugins')));
};

function change(cmd, root, val) {
    var cordova_path = path.join(root, settings.cordovaAppPath),
        cwd = process.cwd(),
        defer = Q.defer();
    fs.exists(val, function (exists) {
        // if val does not exist it must be a repository or a plugin name
        var resolved = exists ? path.resolve(root, val) : val;
        process.chdir(cordova_path);
        cordova.plugin(cmd, [resolved], function (err) {
            process.chdir(cwd);
            if(err) {
                defer.reject(err);
                return;
            }
            if (cmd === 'add') {
                list(root).then(function (installedPlugins) {
                    tarifaFile.parse(path.resolve(root))
                        .then(function (localSettings) {
                            var newplugins = installedPlugins.filter(function (ip) {
                                return localSettings.plugins.indexOf(ip) < 0;
                            });
                            defer.resolve(newplugins[0]);
                        }, function (err) {
                            defer.reject(err);
                        });
                });
            }
            else {
                defer.resolve(resolved);
            }
        });
    });
    return defer.promise;
}

module.exports.add = function add(root, uri) {
    return change('add', root, uri);
};

module.exports.remove = function remove(root, name) {
    return change('remove', root, name);
};

module.exports.list = list;
