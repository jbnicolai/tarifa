#!/usr/bin/env node

var argv = process.argv.slice(2);
var browserify = require('browserify');
var path = require('path');
var fs = require('fs');
var b = browserify();

var output = path.join(__dirname, '../www/main.js');
if(fs.exist(output)) fs.unlinkSunc(output);

var ws = fs.createWriteStream(path.join(__dirname, '../www/main.js'));

function usage(n, m) {
    console.log(m || 'build configuration.json');
    process.exit(n);
}

if (!argv[0]) usage(1);
if (argv[0] && !fs.exists(argv[0])) usage(2, 'file does not exist!');

b.add(path.join(__dirname, '../src/app.js'))
    .require(argv[0], {expose: 'configuration'})
    .bundle()
    .pipe(ws);
