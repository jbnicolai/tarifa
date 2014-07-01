// adb install -r platforms/android/ant-build/lclstorage-debug.apk;
// open the app
// adb shell am start com.lcl.test.storage/com.lcl.test.storage.lclstorage
var Q = require('q'),
    cordova = require('cordova'),
    exec = require('child_process').exec,
    argsHelper = require('../../lib/args'),
    settings = require('../../lib/settings'),
    path = require('path'),
    fs = require('fs'),
    buildAction = require('../build');

var run = function (platform, config, verbose) {
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

    buildAction.build(platform, config, verbose).then(function (err) {
        if(err) defer.reject(err);
        switch(platform) {
            case 'android':
                installAndroidApp(localSettings, config, verbose).then(function () {
                    return openAndroidApp(localSettings, config, verbose);
                    // TODO would be also nice to be able to open chrome with the inspector
                    // right on the chrome webview
                }).then(function () {
                    defer.resolve();
                }, function (err) {
                    defer.reject(err);
                });
                break;
            case 'ios':
                console.log('TODO, impl. install + open ios app');
                defer.resolve();
                break;
            default:
                 defer.reject('platform unknown!');
        }
    });

    return defer.promise;
};

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
    // adb shell am start com.lcl.test.storage/com.lcl.test.storage.lclstorage
    var cmd = settings.external.adb.name + ' shell am start ' + localSettings.configurations['android'][config].id + '/'+ localSettings.configurations['android'][config].id + '.' + localSettings.name;

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
