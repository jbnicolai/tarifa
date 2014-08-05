var path = require('path'),
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

    process.chdir(cordova_path);

    cordova.plugin(cmd, [val], function (err) {
        process.chdir(cwd);
        if(err) {
            defer.reject(err);
            return;
        }
        if (cmd === 'add') {
            list(root).then(function (installedPlugins) {
                tarifaFile.parseConfig(path.join(root, 'tarifa.json'))
                    .then(function (localSettings) {
                        var newplugins = installedPlugins.filter(function (ip) {
                            return localSettings.plugins.indexOf(ip) < 0;
                        });
                        defer.resolve(newplugins[0]);
                    });
            });
        }
        else {
            defer.resolve(val);
        }
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
