var Q = require('q'),
    cordova = require('cordova'),
    argsHelper = require('../../lib/args'),
    settings = require('../../lib/settings'),
    path = require('path'),
    fs = require('fs'),
    prepareAction = require('../prepare');

var build = function (platform, config, verbose) {
    // check if we have a tarifa.json file on the current dir
    var tarifaFilePath = path.join(process.cwd(), 'tarifa.json');
    if(!fs.existsSync(path.join(process.cwd(), 'tarifa.json')))
        return Q.reject(new Error('No tarifa.json file available in the current working directory!'));

    // check that we have the wanted platform and configuration
    var localSettings = require(tarifaFilePath);

    if(settings.platforms.indexOf(platform) < 0) {
        return Q.reject(new Error('platform not availble!'));
    }

    if (localSettings.platforms.indexOf(platform) < 0) {
        return Q.reject(new Error('platform not described in tarifa.json'));
    }

    if(!localSettings.configurations[platform][config]) {
        return Q.reject(new Error('configuration ' + platform + ' not described in tarifa.json'));
    }

    var defer = Q.defer();
    var cordova_path = path.join(process.cwd(), settings.cordovaAppPath);
    var localConf = localSettings.configurations[platform][config];
    // TODO for ios
    var mode = (platform === 'android' && (localConf.keystore_path && localConf.keystore_alias)) ? '--release' : null;

    if(verbose) console.log('start to build the www project');
    prepareAction.prepare(platform, config, verbose).then(function () {
        process.chdir(cordova_path);
        if(verbose) console.log('start cordova build');

        cordova.build({
            verbose: verbose,
            platforms: [ platform ],
            options: mode ? [ mode ] : []
        }, function (err, result) {
            process.chdir('..');
            if(err) defer.reject(err);
            defer.resolve();
        });
    });

    return defer.promise;
};

var action = function (argv) {
    var verbose = false;
    if(argsHelper.matchSingleOptions(argv, 'h', 'help')) {
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    if(argsHelper.matchSingleOptions(argv, 'V', 'verbose', [1,2])) {
        verbose = true;
    } else if(argv._.length != 1 && argv._.length != 2) {
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    var tmp = argv._[0].split(':');
    return build(tmp[0], tmp[1] || 'default', verbose);
}

action.build = build;
module.exports = action;
