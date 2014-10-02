var path = require('path'),
    fs = require('fs'),
    cordova = require('cordova-lib').cordova,
    findPlugins = require('cordova-lib/src/cordova/util').findPlugins,
    Q = require('q'),
    Configstore = require('configstore'),
    format = require('util').format,
    settings = require('../settings'),
    difference = require("interset/difference"),
    tarifaFile = require('../tarifa-file');

function list(root) {
    return Q.resolve(findPlugins(path.join(root, settings.cordovaAppPath, 'plugins')));
};

function change(cmd, root, val) {
    var cordova_path = path.join(root, settings.cordovaAppPath),
        cwd = process.cwd(),
        resolved = fs.existsSync(val) ? path.resolve(root, val) : val,
        pluginListPromise = list(root);

    process.chdir(cordova_path);
    return cordova.raw['plugin'](cmd, resolved).then(function () {
        process.chdir(cwd);
        return Q.all([pluginListPromise, list(root)]).spread(function(beforList, afterList) {
            var diff = difference(beforList, afterList);
            if (diff.length != 1) diff = difference(afterList, beforList);
            if(diff.length != 1) return Q.reject(format("Failed to %s cordova plugin via uri %s", cmd, val));
            else return { uri: val, val: diff[0] };
        });
    });
}

module.exports.add = function add(root, uri) {
    return change('add', root, uri);
};

module.exports.remove = function remove(root, name) {
    return change('remove', root, name);
};

module.exports.list = list;

module.exports.listAvailable = function() {
    var tarifaPlugins = JSON.parse(fs.readFileSync(path.join(__dirname, '../plugins.json'))),
        conf = new Configstore('tarifa'),
        userPlugins = conf.get('plugins');

    tarifaPlugins = tarifaPlugins.filter(function (plugin) { return !plugin["default"]; });

    if(userPlugins) return tarifaPlugins.concat(userPlugins);
    else return tarifaPlugins;
};
