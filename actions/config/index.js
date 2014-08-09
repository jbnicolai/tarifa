var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
    argsHelper = require('../../lib/helper/args'),
    devices = require('./ios/devices'),
    assets = require('./assets'),
    print = require('../../lib/helper/print'),
    provisioning = require('./ios/provisioning');

var cmds = {
    ios: {
        devices: {
            list:   { action: devices.list,   n: [0, 1] },
            add:    { action: devices.add,    n: [2] },
            remove: { action: devices.remove, n: [2] },
            attach: { action: devices.attach, n: [2] },
            detach: { action: devices.detach, n: [2] }
        },
        provisioning: {
            fetch: { action: provisioning.fetch, n: [1] },
            list:  { action: provisioning.list,  n: [0] }
        }
    },
    icons:         { action: assets.generateIcons,         n: [2] },
    splashscreens: { action: assets.generateSplashscreens, n: [2] }
};

function printHelp() {
    return fs.read(path.join(__dirname, 'usage.txt')).then(print);
}

var config = function (args, verbose) {
    var p = args[0],
        t = args[1],
        c = args[2],
        cmd_exists = cmds[p] && cmds[p][t] && cmds[p][t][c],
        validArgsCount = cmd_exists && cmds[p][t][c]['n'].indexOf(args.length-3) >-1,
        isAssetsCmds = ['icons', 'splashscreens'].indexOf(p) > -1;

    if(cmd_exists && validArgsCount)
        return cmds[p][t][c]['action'](args.splice(2, args.length-1), verbose);
    else if(isAssetsCmds && args.length === 3)
        return cmds[p](args.splice(1, args.length-1), verbose)
    else return printHelp();
};

var action = function (argv) {
    var verbose = false;

    if(argsHelper.matchArgumentsCount(argv, [3,5])
            && argsHelper.checkValidOptions(argv, ['V', 'verbose'])) {
        if(argsHelper.matchOption(argv, 'V', 'verbose'))
            verbose = true;
        return config(argv._, verbose);
    }
    return printHelp();
};

action.config = config;
module.exports = action;
