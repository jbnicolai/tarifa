var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
    argsHelper = require('../../lib/helper/args'),
    devices = require('./ios/devices'),
    assets = require('./assets'),
    print = require('../../lib/helper/print'),
    provisioning = require('./ios/provisioning');

function printHelp() {
    return fs.read(path.join(__dirname, 'usage.txt')).then(print);
}

function match(_, cmd) {
    if(_.length > cmd.length) return false;
    return cmd.reduce(function(val, word, idx) {
        if(!val) return val;
        if(word === '+') return val;
        if(word === '*' && _[idx]) return val;
        if(word === _[idx]) return val;
        return !val;
    }, true);
}

var action = function (argv) {
    var verbose = false;

    if(argsHelper.checkValidOptions(argv, ['V', 'verbose'])) {
        if(argsHelper.matchOption(argv, 'V', 'verbose'))
            verbose = true;

        if(match(argv._, ['ios', 'devices', 'list', '+'])) return devices.list(argv._[3], verbose);
        if(match(argv._, ['ios', 'devices', 'add', '*', '*'])) return devices.add(argv._[3], argv._[4], verbose);
        if(match(argv._, ['ios', 'devices', 'attach', '*', '*'])) return devices.attach(argv._[3], argv._[4], verbose);
        if(match(argv._, ['ios', 'devices', 'detach', '*', '*'])) return devices.detach(argv._[3], argv._[4], verbose);

        if(match(argv._, ['provisioning', 'fetch', '*'])) return provisioning.fetch(argv._[3], verbose);
        if(match(argv._, ['provisioning', 'list'])) return provisioning.fetch(verbose);

        if(match(argv._, ['icons', 'generate', '*', '+'])) return assets.generateIcons(argv._[2], argv._[3], verbose);
        if(match(argv._, ['icons', 'file', '*', '+'])) return assets.generateIconsFromFile(argv._[2], argv._[3], verbose);
        if(match(argv._, ['splashscreens', 'generate', '*', '+'])) return assets.generateSplashscreens(argv._[2], argv._[3], verbose);
        if(match(argv._, ['splashscreens', 'file', '*', '+'])) return assets.generateSplashscreensFromFile(argv._[2], argv._[3], verbose);

        return printHelp();
    }
    return printHelp();
};

module.exports = action;
