var path = require('path'),
    fs = require('fs'),
    cordova = require('cordova-lib').cordova,
    findPlugins = require('cordova-lib/src/cordova/util').findPlugins,
    Q = require('q'),
    Configstore = require('configstore'),
    format = require('util').format,
    settings = require('../settings'),
    pathHelper = require('../helper/path'),
    difference = require("interset/difference"),
    xml2js = require('xml2js'),
    tarifaFile = require('../tarifa-file');

function list(root) {
    return Q.resolve(findPlugins(path.join(root, settings.cordovaAppPath, 'plugins')));
};

function listAll() {
    var tarifaPlugins = JSON.parse(fs.readFileSync(path.join(__dirname, '../plugins.json'))),
        conf = new Configstore('tarifa'),
        userPlugins = conf.get('plugins');

    if(userPlugins) return tarifaPlugins.concat(userPlugins);
    else return tarifaPlugins;
};

function change(cmd, root, val) {
    var cordova_path = path.join(root, settings.cordovaAppPath),
        cwd = process.cwd(),
        resolved = fs.existsSync(pathHelper.resolve(val)) ? pathHelper.resolve(val) : val,
        pluginListPromise = tarifaFile.parse(root).then(function (localSettings) {
            return localSettings.plugins ? Object.keys(localSettings.plugins) : [];
        });

    process.chdir(cordova_path);

    return cordova.raw.plugin(cmd, resolved).then(function () {
        process.chdir(cwd);
        return Q.all([pluginListPromise, list(root)]).spread(function(beforeList, afterList) {
            var diff = difference(beforeList, afterList);
            if(cmd === 'add') {
                if (diff.length == 0) return difference(afterList, beforeList);
                else Q.reject(format("tarifa.json plugins definition contains more plugins than the cordova app!"));
            }
            else {
                if (diff.length > 0) return diff;
                else Q.reject(format("cordova app contains more plugins than described in the tarifa.json file!"));
            }
        });
    }).then(function (diff) {
        if (cmd === 'add') {
            if (diff.length) return diff[diff.length-1];
            return diff.reduce(function (resultP, id) {
                return resultP.then(function (result) {
                    if(result) return result;

                    var pluginXml = fs.readFileSync(path.join(cordova_path, 'plugins', id, 'plugin.xml'), 'utf-8'),
                        defer = Q.defer();

                    xml2js.parseString(pluginXml, function (err, pluginObj) {
                        if(err) return defer.reject(err);
                        else {
                            if(pluginObj.plugin.dependency) {
                                var ids = pluginObj.plugin.dependency.map(function (dep) { return dep.$.id; });
                                defer.resolve(ids.indexOf(id) < 0 ? id : false);
                            } else {
                                defer.resolve(result);
                            }
                        }
                    });
                    return defer.promise;
                });
            }, Q.resolve());
        } else {
            return diff[0];
        }
    }).then(function (id) {
        return {
            val : id,
            uri : val
        };
    });
}

module.exports.add = function add(root, uri) {
    return change('add', root, uri);
};

module.exports.remove = function remove(root, name) {
    return change('remove', root, name);
};

module.exports.list = list;

module.exports.listAll = listAll;

module.exports.listAvailable = function () {
    return listAll().filter(function (plugin) { return !plugin["default"]; });
};
