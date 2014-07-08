var Q = require('q'),
    exec = require('child_process').exec,
    settings = require('../../../../lib/settings');

module.exports = function (localSettings, config, verbose) {
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
            defer.reject('adb ' + err);
        }
        else {
            defer.resolve();
        }
    });

    return defer.promise;
};
