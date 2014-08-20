var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
    argsHelper = require('../../lib/helper/args'),
    print = require('../../lib/helper/print'),
    hockeyapp = require('./hockeyapp'),
    match = require('../../lib/helper/args').matchCmd;

function printHelp() {
    return fs.read(path.join(__dirname, 'usage.txt')).then(print);
}

var action = function (argv) {
    var verbose = false;

    if(argsHelper.checkValidOptions(argv, ['V', 'verbose'])) {
        if(argsHelper.matchOption(argv, 'V', 'verbose'))
            verbose = true;

        if(match(argv._, ['hockeyapp', 'deploy', '*'])) return hockeyapp.deploy(argv._[2], verbose);
        if(match(argv._, ['hockeyapp', 'clean', '+'])) return hockeyapp.clean(argv._[2], verbose);

        return printHelp();
    }
    return printHelp();
};

module.exports = action;
