#!/usr/bin/env node

var parser = require('nomnom'),
    pkg = require('../package.json'),

    info = require('../actions/info'),
    create = require('../actions/create'),
    prepare = require('../actions/prepare'),
    build = require('../actions/build'),
    run = require('../actions/run'),
    upgrade = require('../actions/upgrade'),
    publish = require('../actions/publish');

var actions = [create, prepare, build, run, upgrade, publish, info];

function help() {
    console.log(parser.getUsage());
    process.exit(1);
}

parser.script("tarifa")
    .nocolors()
    .nocommand()
    .callback(help)
    .help("Opinated workflow for cordova mobile apps with browserify and friends");

actions.forEach(function (action) {
    var c = parser.command(action.name)
        .callback(action.action)
        .help(action.help);

    action.options.forEach(function (option) {
        c.option(option.name, option.option)
    });
});

parser.option('version', {
      flag: true,
      abbr: 'v',
      help: 'print version and exit',
      callback: function() {
          console.log("v" + pkg.version);
          process.exit(0);
      }
   });

parser.option('help', {
      flag: true,
      abbr: 'h',
      help: 'print this text'
   });

parser.parse();
