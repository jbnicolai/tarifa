#!/usr/bin/env node

var tarifa = require('../lib/tarifa'),
    pkg = require('../package.json'),
    parser = require('nomnom');

parser.script("tarifa");

// default command, trigger the interactive mode
parser.command('')
   .callback(function(opts) {
      console.log('entering the interactive mode...');
   })
   .help("interactive mode");

parser.command('create')
   .callback(function(opts) {
      console.log('...');
   })
   .help("Create a new project...");

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
