var Q = require('q'),
    fs = require('fs'),
    path = require('path'),
    argsHelper = require('../../lib/helper/args'),
    devices = require('./ios/devices'),
    assets = require('./assets'),
    provisioning = require('./ios/provisioning');

var cmds = {
    ios: {
        devices: {
            list: devices.list,
            add: devices.add,
            remove: devices.remove,
            attach: devices.attach,
            detach: devices.detach
        },
        provisioning: {
            fetch: provisioning.fetch,
            list: provisioning.list
        }
    },
    icons: assets.generateIcons,
    splashscreens: assets.generateSplashscreens
};

var usage = function () {
    console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
};

var config = function (args, verbose) {
    if (args.length >=3) {
        var p = args[0],
            t = args[1],
            c = args[2],
            cmd_exists = cmds[p] && cmds[p][t] && cmds[p][t][c];

        if(cmd_exists) {
            return cmds[p][t][c](args.splice(2, args.length-1), verbose);
        }
        else if(['icons', 'splashscreens'].indexOf(p) > -1) {
            return cmds[p](args.splice(1, args.length-1), verbose)
        }
        else {
            usage();
            return Q.resolve();
        }
    }
    usage();
    return Q.resolve();
};

var action = function (argv) {
    var verbose = false;
    if(argsHelper.matchSingleOptions(argv, 'h', 'help')) {
        usage();
        return Q.resolve();
    }

    if(argsHelper.matchSingleOptions(argv, 'V', 'verbose')) verbose = true;
    return config(argv._, verbose);
};

action.config = config;

module.exports = action;
