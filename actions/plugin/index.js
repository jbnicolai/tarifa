var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
    argsHelper = require('../../lib/helper/args'),
    tarifaFile = require('../../lib/tarifa-file'),
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

function addToTarifaFile(root) {
    return function (val) { return tarifaFile.addPlugin(root, val); }
}

function removeFromTarifaFile(root) {
    return function (val) { return tarifaFile.removePlugin(root, val); }
}

function list(verbose) {
    return plugins.list(path.dirname(process.cwd())).then(printPlugins);
}

function plugin (action, arg, verbose) {
    var root = process.cwd();
    return tarifaFile.parse(root)
        .then(function () {
            return plugins[action](root, arg)
                .then(addToTarifaFile(root))
                .then(log(action, verbose));
        });
}

function action (argv) {
    var verbose = false,
        actions = ['add', 'remove'],
        helpPath = path.join(__dirname, 'usage.txt');

    if(argsHelper.checkValidOptions(argv, ['V', 'verbose'])) {
        if(argsHelper.matchOption(argv, 'V', 'verbose')) {
            verbose = true;
        }
        if(argv._[0] === 'list' && argsHelper.matchArgumentsCount(argv, [1])){
            return list(verbose);
        }
        if(actions.indexOf(argv._[0]) > -1
            && argsHelper.matchArgumentsCount(argv, [2])) {
            return plugin(argv._[0], argv._[1], verbose);
        }
    }

    return fs.read(helpPath).then(print);
}

action.plugin = plugin;
module.exports = action;
