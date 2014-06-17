var Q = require('q'),
    rimraf = require('rimraf'),
    argsHelper = require('../../lib/args'),
    settings = require('../../lib/settings'),
    path = require('path'),
    fs = require('fs');

/*
 * First draft
 * tarifa prepare configuration
 * tarifa prepare ios:staging
 *
 * TODO  
 *  tarifa prepare -> te demande ce que tu veux preparer...
 * multi call 
 * ex tarifa prepare ios:staging android:staging android:production
 */

module.exports = function (argv) {
    if(argsHelper.matchSingleOptions(argv, 'h', 'help')) {
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    if(argsHelper.matchSingleOptions(argv, 'V', 'verbose')) {
        verbose = true;
    } else if(argv._.length != 1) {
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    // check if we have a tarifa.json file on the current dir
    var tarifaFilePath = path.join(process.cwd(), 'tarifa.json');
    if(!fs.existsSync(path.join(process.cwd(), 'tarifa.json')))
        return Q.reject(new Error('no tarifa.json file available in the current working directory!'));

    // extract platform and configuration
    var localSettings = require(tarifaFilePath);
    var tmp = argv._[0].split(':');
    var platform = tmp[0];
    var config = tmp[1];

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

    // build www project whith it's own build module
    var builder = require(path.join(process.cwd(), settings.build));
    return defer.promise.then(function () {
        return builder(platform, localSettings.configurations[platform][config]);
    });

    // we may need to unlink...
};
