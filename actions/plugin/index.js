var Q = require('q'),
    chalk = require('chalk'),
    argsHelper = require('../../lib/helper/args'),
    tarifaFile = require('../../lib/tarifa-file'),
    path = require('path'),
    tarifaPath = require('../../lib/helper/path'),
    print = require('../../lib/helper/print'),
    plugins = require('../../lib/cordova/plugins'),
    fs = require('fs');

function printPlugins(items) {
    print(items.length ?  items.join('\n') : "no plugin installed!");
}
function log(action, verbose) {
    return function (val) { if(verbose) print("plugin %sed: %s", action, val); }
}

function addToTarifaFile(root) {
    return function (val) { return tarifaFile.addPlugin(root, val); }
}

function removeFromTarifaFile(root) {
    return function (val) { return tarifaFile.removePlugin(root, val); }
}

function plugin (action, arg, verbose) {

    var rootFile = tarifaPath.current();
    var root = path.dirname(rootFile);

    return tarifaFile.parseConfig(rootFile)
        .then(function () {
            switch(action) {
                case 'add':
                    return plugins.add(root, arg)
                        .then(addToTarifaFile(rootFile))
                        .then(log(action, verbose));
                case 'remove':
                    return plugins.remove(root, arg)
                        .then(removeFromTarifaFile(rootFile))
                        .then(log(action, verbose));
                case 'list':
                default:
                    return plugins.list(root).then(printPlugins);
            }
        });
}

function action (argv) {
    var verbose = false;
    var actions = ['add', 'remove', 'list'];
    var validAction = actions.filter(function (a) {
            return a === argv._[0];
        }).length === 1;

    if(argsHelper.matchSingleOptions(argv, 'h', 'help')) {
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    if(argsHelper.matchSingleOptions(argv, 'V', 'verbose')) {
        verbose = true;
    } else if(argv._.length != 1 && argv._.length != 2) {
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    if(!validAction) return Q.reject('action unknown!');
    if(argv._[0] === undefined || argv._[0] === 'list')
        return plugin(argv._[0], null, verbose);
    if(argv._[1] === undefined) return Q.reject('plugin name unknown!');

    return plugin(argv._[0], argv._[1], verbose);
}

action.plugin = plugin;

module.exports = action;
