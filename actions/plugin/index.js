var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
    format = require('util').format,
    argsHelper = require('../../lib/helper/args'),
    tarifaFile = require('../../lib/tarifa-file'),
    pathHelper = require('../../lib/helper/path'),
    print = require('../../lib/helper/print'),
    plugins = require('../../lib/cordova/plugins');

function printPlugins(items) {
    print(items.length ?  items.join('\n') : "no plugin installed!");
}

function log(action, verbose) {
    return function (val) {
        if(verbose) {
            if(val) print("%s plugin: %s", action, val);
            else print("no plugin added!");
        }
    }
}

var actions = {
    'add': {
        updateTarifaFile: function (root) {
            return function (val) {
                if(val)
                    return tarifaFile.addPlugin(root, val);
                else
                    return Q.reject("Plugin is already installed!");
            };
        }
    },
    'remove': {
        updateTarifaFile: function (root) {
            return function (val) {
                return tarifaFile.removePlugin(root, val);
            };
        }
    }
}

function list(verbose) {
    return plugins.list(pathHelper.root()).then(printPlugins);
}

function plugin(action, arg, verbose) {
    return raw_plugin(pathHelper.root(), action, arg, verbose);
}

function raw_plugin (root, action, arg, verbose) {
    return tarifaFile.parse(root)
        .then(function (settings) {
            if(action == 'remove' && settings.plugins.indexOf(arg) < 0)
                return Q.reject(format("Can't remove uninstalled plugin %s", arg));
            if(action == 'add' && settings.plugins.indexOf(arg) > -1)
                return Q.reject(format("Can't installed already installed plugin %s", arg));
            return plugins[action](root, arg)
                .then(actions[action].updateTarifaFile(root))
                .then(log(action, verbose));
        });
}

function action (argv) {
    var verbose = false,
        helpPath = path.join(__dirname, 'usage.txt');

    if(argsHelper.checkValidOptions(argv, ['V', 'verbose'])) {
        if(argsHelper.matchOption(argv, 'V', 'verbose')) {
            verbose = true;
        }
        if(argv._[0] === 'list' && argsHelper.matchArgumentsCount(argv, [1])){
            return list(verbose);
        }
        if(Object.keys(actions).indexOf(argv._[0]) > -1
            && argsHelper.matchArgumentsCount(argv, [2])) {
            return plugin(argv._[0], argv._[1], verbose);
        }
    }

    return fs.read(helpPath).then(print);
}

action.plugin = plugin;
action.raw_plugin = raw_plugin;
module.exports = action;
