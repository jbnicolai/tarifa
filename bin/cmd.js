#!/usr/bin/env node

var chalk = require('chalk'),
    fs = require('q-io/fs'),
    path = require('path'),
    argv = require('minimist')(process.argv.slice(2)),
    pkg = require('../package.json'),
    print = require('../lib/helper/print'),
    argsHelper = require('../lib/helper/args'),
    create = require('../actions/create'),
    platform = require('../actions/platform'),
    plugin = require('../actions/plugin'),
    prepare = require('../actions/prepare'),
    build = require('../actions/build'),
    run = require('../actions/run'),
    config = require('../actions/config'),
    info = require('../actions/info'),
    check = require('../actions/check'),
    hockeyapp = require('../actions/hockeyapp'),
    clean = require('../actions/clean');

var t0 = (new Date()).getTime();

var availableActions = [
        { name : 'create', action : create },
        { name : 'platform', action: platform },
        { name : 'plugin', action: plugin },
        { name : 'prepare', action : prepare },
        { name : 'info', action : info },
        { name : 'config', action : config },
        { name : 'build', action : build },
        { name : 'run', action : run },
        { name : 'clean', action : clean },
        // clean alias
        { name : 'cls', action : clean },
        { name : 'check', action : check },
        { name : 'hockeyapp', action: hockeyapp }
    ],
    singleOptions = [
        { small: 'v', name : 'version', action : printVersion },
        { small: 'h', name : 'help', action : printHelp }
    ];

function printHelp(errMessage) {
    if(errMessage) print(errMessage);
    fs.read(path.join(__dirname, 'usage.txt'))
        .then(function (help) {
            print(help);
            process.exit(0);
        });
}

function printVersion() {
    print(pkg.version);
    process.exit(0);
}

function matchAction(args) {
    var actions = availableActions.map(function (a) { return a.name; });
    return args._[0] && actions.indexOf(args._[0]) >= 0;
}

function actionSuccess(val) {
    var t = (new Date()).getTime();
    print(chalk.magenta('done in ~ %ds'), Math.floor((t-t0)/1000));
}

function actionError(name) {
    return function (err) {
        print.trace(err);
    };
}

function main(args) {
    for(var i=0, l=singleOptions.length; i<l; i++) {
        if(argsHelper.matchSingleOptionWithArguments(args, singleOptions[i].small, singleOptions[i].name, [0])) {
            return singleOptions[i].action();
        }
    }

    if(matchAction(args)) {
        var action = args._.shift(0);
        availableActions
            .filter(function (a) { return a.name == action; })[0].action(args)
            .done(actionSuccess, actionError(action));
    } else {
        printHelp(args.length && "Tarifa does not know " + args._.join(' ') + '\n');
    }
}

main(argv);
