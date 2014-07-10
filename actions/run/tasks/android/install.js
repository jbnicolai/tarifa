var Q = require('q'),
    exec = require('child_process').exec,
    settings = require('../../../../lib/settings');

module.exports = function (localSettings, config, verbose) {
    var defer = Q.defer();
    var mode = localSettings.mode ? '-release.apk' : '-debug.apk';
    var apk_filename = localSettings.configurations['android'][config].product_file_name + mode;
    var cmd = settings.external.adb.name + ' install -rl ' + 'app/platforms/android/ant-build/' + apk_filename;

    var options = {
        timeout : 6000,
        maxBuffer: 1024 * 400
    };

    exec(cmd, options, function (err, stdout, stderr) {
        if(verbose && !! err && stdout) console.log('adb output ' + stdout);
        if(err) {
            if(verbose) console.log('adb stderr ' + stderr);
            defer.reject('adb ' + err);
        }
        else {
            defer.resolve();
        }
    });

    return defer.promise;
};
