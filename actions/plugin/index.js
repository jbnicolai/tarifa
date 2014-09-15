var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
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
            if(val) print("plugin %sed: %s", action, val);
            else print("no plugin added!");
        }
    }
}

var actions = {
    'add': {
        updateTarifaFile: function (root) {
            return function (val) { return tarifaFile.addPlugin(root, val) };
        }
    },
    'remove': {
        updateTarifaFile: function (root) {
            return function (val) { return tarifaFile.removePlugin(root, val) };
        }
    }
}

function list(verbose) {
    return plugins.list(pathHelper.root()).then(printPlugins);
}

function plugin (action, arg, verbose) {
    var root = pathHelper.root();
    return tarifaFile.parse(root)
        .then(function () {
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
module.exports = action;
