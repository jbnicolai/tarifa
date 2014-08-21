var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
    argsHelper = require('../../lib/helper/args'),
    devices = require('./ios/devices'),
    assets = require('./assets'),
    print = require('../../lib/helper/print'),
    match = require('../../lib/helper/args').matchCmd,
    provisioning = require('./ios/provisioning');

function printHelp() {
    return fs.read(path.join(__dirname, 'usage.txt')).then(print);
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

        if(match(argv._, ['provisioning', 'list'])) return provisioning.list(verbose);

        if(match(argv._, ['icons', 'generate', '*', '+'])) return assets.generateIcons(argv._[2], argv._[3], verbose);
        if(match(argv._, ['icons', 'file', '*', '+'])) return assets.generateIconsFromFile(argv._[2], argv._[3], verbose);
        if(match(argv._, ['splashscreens', 'generate', '*', '+'])) return assets.generateSplashscreens(argv._[2], argv._[3], verbose);
        // TODO: we must improve this command in order to make it public
        // it must take into account the different splashscreen ratios
        // if(match(argv._, ['splashscreens', 'file', '*', '+'])) return assets.generateSplashscreensFromFile(argv._[2], argv._[3], verbose);

        return printHelp();
    }
    return printHelp();
};

module.exports = action;
