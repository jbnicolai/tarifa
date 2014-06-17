var Q = require('q'),
    rimraf = require('rimraf'),
    argsHelper = require('../../lib/args'),
    settings = require('../../lib/settings'),
    path = require('path'),
    fs = require('fs');

module.exports = function (argv) {
    if(argsHelper.matchSingleOptions(argv, 'h', 'help')) {
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    if(argsHelper.matchSingleOptions(argv, 'V', 'verbose')) {
        verbose = true;
    } else if(argv._.length != 1 && argv._.length != 2) {
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    // check if we have a tarifa.json file on the current dir
    var tarifaFilePath = path.join(process.cwd(), 'tarifa.json');
    if(!fs.existsSync(path.join(process.cwd(), 'tarifa.json')))
        return Q.reject(new Error('no tarifa.json file available in the current working directory!'));

    // check that we have the wanted platform and configuration
    var localSettings = require(tarifaFilePath);
    var tmp = argv._[0].split(':');
    var platform = tmp[0];

    if(settings.platforms.indexOf(platform) < 0) {
        return Q.reject(new Error('platform not availble!'));
    }

    if (localSettings.platforms.indexOf(platform) < 0) {
        return Q.reject(new Error('platform not described in tarifa.json'));
    }

    var config = tmp[1] || 'default';

    if(!localSettings.configurations[platform][config]) {
        return Q.reject(new Error('configuration ' + platform + ' not described in tarifa.json'));
    }

    // link app www to project output
    var defer = Q.defer();
    var cordovaWWW = path.join(process.cwd(), settings.cordovaAppPath, 'www');
    var projectWWW = path.join(process.cwd(), settings.project_output);

    rimraf(cordovaWWW, function (err) {
        if(err) defer.reject(err);
        fs.symlink(projectWWW, cordovaWWW, 'dir', function (err) {
            if (err) { defer.reject(err); }
            defer.resolve();
        });
    });

    var builder = require(path.join(process.cwd(), settings.build));
    return defer.promise.then(function () {
        return builder(platform, localSettings.configurations[platform][config]);
    });
};
