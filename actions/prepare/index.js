var Q = require('q'),
    rimraf = require('rimraf'),
    argsHelper = require('../../lib/args'),
    settings = require('../../lib/settings'),
    path = require('path'),
    fs = require('fs');

var prepare = function (platform, config, verbose) {
    // check if we have a tarifa.json file on the current dir
    var tarifaFilePath = path.join(process.cwd(), 'tarifa.json');
    if(!fs.existsSync(path.join(process.cwd(), 'tarifa.json')))
        return Q.reject(new Error('no tarifa.json file available in the current working directory!'));

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

    // link app www to project output
    var defer = Q.defer();
    var cordovaWWW = path.join(process.cwd(), settings.cordovaAppPath, 'www');
    var projectWWW = path.join(process.cwd(), settings.project_output);

    rimraf(cordovaWWW, function (err) {
        if(err) defer.reject(err);
        if(verbose) console.log('prepare, rm cordova www link');
        fs.symlink(projectWWW, cordovaWWW, 'dir', function (err) {
            if (err) { defer.reject(err); }
            if(verbose) console.log('prepare, link www project to cordova www');
            defer.resolve();
        });
    });

    var builder = require(path.join(process.cwd(), settings.build));
    return defer.promise.then(function () {
        if(verbose) console.log('prepare, launch www project build');
        return builder(platform, localSettings.configurations[platform][config]);
    });
}

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
    return prepare(tmp[0], tmp[1] || 'default', verbose);
}

action.prepare = prepare;
module.exports = action;
