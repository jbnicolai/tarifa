#!/usr/bin/env node

var argv = process.argv.slice(2),
    chalk = require('chalk'),
    fs = require('fs'),
    path = require('path'),
    args = require('minimist')(argv),
    pkg = require('../package.json'),
    argsHelper = require('../lib/args'),
    create = require('../actions/create'),
    platform = require('../actions/platform'),
    prepare = require('../actions/prepare'),
    build = require('../actions/build'),
    run = require('../actions/run'),
    config = require('../actions/config'),
    info = require('../actions/info'),
    check = require('../actions/check'),
    clean = require('../actions/clean');

var t0 = (new Date()).getTime();

var availableActions = [
        { name : 'create', action : create },
        { name : 'platform', action: platform },
        { name : 'prepare', action : prepare },
        { name : 'info', action : info },
        { name : 'config', action : config },
        { name : 'build', action : build },
        { name : 'run', action : run },
        { name : 'clean', action : clean },
        { name : 'check', action : check }
    ],
    singleOptions = [
        { small: 'v', name : 'version', action : printVersion },
        { small: 'h', name : 'help', action : printHelp }
    ];

function printHelp(errMessage) {
    if(errMessage) console.log(errMessage);
    console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
    process.exit(0);
}

function printVersion() {
    console.log(pkg.version);
    process.exit(0);
}

function matchAction(arg) {
    return arg._[0] && availableActions.map(function (a) { return a.name; }).indexOf(arg._[0]) >=0;
}

function actionSuccess(val) {
    var t = (new Date()).getTime();
    console.log(chalk.magenta('done in ~ ' + Math.floor((t-t0)/1000) + 's'));
}

function actionError(name) {
    return function (err) {
        console.log(chalk.red(err));
    };
}

function main(arg) {
    singleOptions.forEach(function (option) {
        if(argsHelper.matchSingleOptions(arg, option.small, option.name) && !arg._.length) option.action();
    });

    if(matchAction(arg)) {
        var action = arg._.shift(0);
        availableActions
            .filter(function (a) { return a.name == action; })[0].action(arg)
            .done(actionSuccess, actionError(action));
    } else {
        printHelp(argv.length && "Tarifa does not know " + argv.join(' ') + '\n');
    }
}

main(args);
