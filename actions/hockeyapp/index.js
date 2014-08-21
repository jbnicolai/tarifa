var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
    argsHelper = require('../../lib/helper/args'),
    print = require('../../lib/helper/print'),
    tasks = require('./tasks'),
    match = require('../../lib/helper/args').matchCmd;

function printHelp() {
    return fs.read(path.join(__dirname, 'usage.txt')).then(print);
}

var action = function (argv) {
    var verbose = false;

    if(argsHelper.matchOption(argv, 'V', 'verbose'))
        verbose = true;

    if(match(argv._, ['version', 'upload', '+'])) return tasks.upload(argv._[2], argv, verbose);
    if(match(argv._, ['version', 'clean', '*'])) return tasks.clean(argv._[2], argv, verbose);

    return printHelp();
};

module.exports = action;
