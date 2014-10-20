var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
    argsHelper = require('../../lib/helper/args'),
    print = require('../../lib/helper/print'),
    match = require('../../lib/helper/args').matchCmd;

function printHelp() {
    return fs.read(path.join(__dirname, 'usage.txt')).then(print);
}

var action = function (argv) {
    var verbose = false;

    if(argsHelper.checkValidOptions(argv, ['V', 'verbose'])) {
        if(argsHelper.matchOption(argv, 'V', 'verbose'))
            verbose = true;

        if(match(argv._, ['ios', 'devices', 'list', '*'])) return require('./ios/devices').list(argv._[3], verbose);
        if(match(argv._, ['ios', 'devices', 'add', '+', '+'])) return require('./ios/devices').add(argv._[3], argv._[4], verbose);
        if(match(argv._, ['ios', 'devices', 'attach', '+', '+'])) return require('./ios/devices').attach(argv._[3], argv._[4], verbose);
        if(match(argv._, ['ios', 'devices', 'detach', '+', '+'])) return require('./ios/devices').detach(argv._[3], argv._[4], verbose);

        if(match(argv._, ['provisioning', 'list'])) return require('./ios/provisioning').list(verbose);

        if(match(argv._, ['icons', 'generate', '+', '*'])) return action.generateIcons(argv._[2], argv._[3], verbose);
        if(match(argv._, ['icons', 'file', '+', '*'])) return action.generateIconsFromFile(path.resolve(argv._[2]), argv._[3], verbose);
        if(match(argv._, ['splashscreens', '+', '*'])) return action.generateSplashscreens(argv._[1], argv._[2], verbose);

        return printHelp();
    }
    return printHelp();
};

action.generateIcons = function (color, config, verbose) {
    return require('./assets').generateIcons(color, config, verbose);
};

action.generateIconsFromFile = function (filePath, config, verbose) {
    return require('./assets').generateIconsFromFile(filePath, config, verbose);
};

action.generateSplashscreens = function (color, config, verbose) {
    return require('./assets').generateSplashscreens(color, config, verbose);
};

module.exports = action;
