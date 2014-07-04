var Q = require('q'),
    cordova = require('cordova'),
    exec = require('child_process').exec,
    argsHelper = require('../../lib/args'),
    settings = require('../../lib/settings'),
    tarifaFile = require('../../lib/tarifa-file'),
    path = require('path'),
    fs = require('fs'),
    buildAction = require('../build');

var installAndroidApp = function (localSettings, config, verbose) {
    var defer = Q.defer();
    // TODO need to check the mode (debug/release)
    var apk_filename = localSettings.configurations['android'][config].product_file_name + '-debug.apk';
    var cmd = settings.external.adb.name + ' install -r ' + 'app/platforms/android/ant-build/' + apk_filename;

    var options = {
        timeout : 6000,
        maxBuffer: 1024 * 400
    };

    exec(cmd, options, function (err, stdout, stderr) {
        if(verbose && !! err && stdout) console.log('adb output ' + stdout);
        if(err) {
            if(verbose) console.log('adb stderr ' + stderr);
            return defer.reject('adb ' + err);
        }
        else defer.resolve();
    });

    return defer.promise;
};

var openAndroidApp = function (localSettings, config, verbose) {
    var defer = Q.defer();
    var cmd = settings.external.adb.name
        + ' shell am start '
        + localSettings.configurations['android'][config].id
        + '/'+ localSettings.configurations['android'][config].id
        + '.' + localSettings.name;

    var options = {
        timeout : 6000,
        maxBuffer: 1024 * 400
    };

    exec(cmd, options, function (err, stdout, stderr) {
        if(verbose && !! err && stdout) console.log('adb output ' + stdout);
        if(err) {
            if(verbose) console.log('adb stderr ' + stderr);
            return defer.reject('adb ' + err);
        }
        else defer.resolve();
    });

    return defer.promise;
};

var run = function (platform, config, verbose) {
    var cwd = process.cwd();
    var tarifaFilePath = path.join(cwd, 'tarifa.json');

    return tarifaFile.parseFromFile(tarifaFilePath, platform, config).then(function (localSettings) {
        return buildAction.build(platform, config, verbose).then(function (msg) {
            switch(platform) {
                case 'android':
                    return installAndroidApp(localSettings, config, verbose).then(function () {
                        return openAndroidApp(localSettings, config, verbose);
                    });
                case 'ios':
                    // TODO
                    return Q.resolve();
                default:
                     return Q.reject('platform unknown!');
            }
        });
    });
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

    return run(argv._[0], argv._[1] || 'default', verbose);
};

action.run = run;
module.exports = action;
