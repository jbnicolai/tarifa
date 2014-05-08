#!/usr/bin/env node

var parser = require('nomnom'),
    pkg = require('../package.json'),

    interactive = require('../lib/interactive'),

    create = require('../actions/create'),
    build = require('../actions/build'),
    run = require('../actions/run'),
    upgrade = require('../actions/upgrade'),
    publish = require('../actions/publish');

var actions = [create, build, run, upgrade, publish];

parser.script("tarifa")
    .nocommand()
    .callback(interactive)
    .help("Opinated workflow for cordova");

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
