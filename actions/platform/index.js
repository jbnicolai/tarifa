var Q = require('q'),
    chalk = require('chalk'),
    argsHelper = require('../../lib/args'),
    tarifaFile = require('../../lib/tarifa-file'),
    path = require('path'),
    platformsLib = require('../../lib/platforms'),
    fs = require('fs');

function platform (action, type, verbose) {
    switch(action) {
        case 'add':
            return platformsLib.add([type], verbose);
        case 'remove':
            return platformsLib.remove([type], verbose);
        case 'list':
            return platformsLib.list(true);
        default:
            return platformsLib.list(true);
    }
}

function action (argv) {
    var verbose = false;
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

    return platform(argv._[0], argv._[1], verbose);
}

action.platform = platform;

module.exports = action;
