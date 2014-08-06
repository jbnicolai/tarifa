var Q = require('q'),
    rimraf = require('rimraf'),
    argsHelper = require('../../lib/helper/args'),
    print = require('../../lib/helper/print'),
    tarifaFile = require('../../lib/tarifa-file'),
    settings = require('../../lib/settings'),
    path = require('path'),
    fs = require('fs');

var prepare = function (platform, config, verbose) {
    var cwd = process.cwd();
    var tarifaFilePath = path.join(cwd, 'tarifa.json');

    return tarifaFile.parseConfig(tarifaFilePath, platform, config).then(function (localSettings) {
        var defer = Q.defer();
        var cordovaWWW = path.join(cwd, settings.cordovaAppPath, 'www');
        var projectWWW = path.join(cwd, settings.project_output);

        if (platform !== 'web') {
            // link app www to project output
            rimraf(cordovaWWW, function (err) {
                if(err) defer.reject(err);
                if(verbose) print.success('prepare, rm cordova www link');
                fs.symlink(projectWWW, cordovaWWW, 'dir', function (err) {
                    if (err) { defer.reject(err); }
                    if(verbose) print.success('prepare, link www project to cordova www');
                    defer.resolve();
                });
            });
        } else {
            defer.resolve();
        }

        // get www project builder lib
        var builder = require(path.join(cwd, settings.build));
        return defer.promise.then(function () {
            if(verbose) print.success('prepare, launch www project build');
            // execute www project builder lib with the asked configuration
            return builder(platform, localSettings, config, verbose);
        });
    });
};

var action = function (argv) {
    var verbose = false;
    if(argsHelper.matchSingleOption(argv, 'h', 'help')) {
        print(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    if(argsHelper.matchSingleOption(argv, 'V', 'verbose')) {
        verbose = true;
    } else if(argv._.length != 1 && argv._.length != 2) {
        print(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    return prepare(argv._[0], argv._[1] || 'default', verbose);
};

action.prepare = prepare;

module.exports = action;
