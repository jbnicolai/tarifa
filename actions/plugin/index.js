var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
    format = require('util').format,
    argsHelper = require('../../lib/helper/args'),
    tarifaFile = require('../../lib/tarifa-file'),
    pathHelper = require('../../lib/helper/path'),
    print = require('../../lib/helper/print'),
    settings = require('../../lib/settings'),
    pluginXML = require('../../lib/xml/plugin.xml'),
    plugins = require('../../lib/cordova/plugins');

function printPlugins(items) {
    if(items.length === 0) {
        print("no plugin installed!");
        return Q.resolve();
    }

    return items.reduce(function (promise, p) {
        return promise.then(function () {
            var pluginPath = path.join(process.cwd(), settings.cordovaAppPath, 'plugins', p, 'plugin.xml');
            return pluginXML.getVersion(pluginPath)
                .then(function (v) {
                    print('%s@%s', p, v);
                });
        });
    }, Q.resolve());
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
            return function (def) {
                return tarifaFile.addPlugin(root, def.val, def.uri);
            };
        }
    },
    'remove': {
        updateTarifaFile: function (root) {
            return function (def) {
                return tarifaFile.removePlugin(root, def.val);
            };
        }
    }
}

function list() {
    return plugins.list(pathHelper.root());
}

function plugin(action, arg, verbose) {
    return raw_plugin(pathHelper.root(), action, arg, verbose);
}

function raw_plugin (root, action, arg, verbose) {
    return tarifaFile.parse(root)
        .then(function (settings) {
            if(action == 'remove' && (!settings.plugins || Object.keys(settings.plugins).indexOf(arg) < 0))
                return Q.reject(format("Can't remove uninstalled plugin %s", arg));
            if(action == 'add' && (settings.plugins && Object.keys(settings.plugins).indexOf(arg) > -1))
                return Q.reject(format("Can't install already installed plugin %s", arg));
            return plugins[action](root, arg)
                .then(function (val) {
                    if (!val || !val.val || !val.uri) {
                        return Q.reject("no plugin changed!");
                    }
                    return val;
                })
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
            return list().then(printPlugins);
        }
        if(Object.keys(actions).indexOf(argv._[0]) > -1
            && argsHelper.matchArgumentsCount(argv, [2])) {
            return plugin(argv._[0], argv._[1], verbose);
        }
    }

    return fs.read(helpPath).then(print);
}

action.plugin = plugin;
action.list = list;
module.exports = action;
