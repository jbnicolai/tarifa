var Q = require('q'),
    exec = require('child_process').exec,
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings');

module.exports = function (localSettings, config, device, verbose) {
    var defer = Q.defer();
    var mode = localSettings.mode ? '-release.apk' : '-debug.apk';
    var apk_filename = localSettings.configurations['android'][config].product_file_name + mode;
    var cmd = settings.external.adb.name + ' -s ' + device.value + ' install -rl ' + 'app/platforms/android/ant-build/' + apk_filename;
    var options = {
        timeout : 6000,
        maxBuffer: 1024 * 400
    };

    if(verbose)
        print.success('trying to install android app: %s', apk_filename);

    exec(cmd, options, function (err, stdout, stderr) {
        if(verbose && !! err && stdout) print('adb output %s', stdout);
        if(err) {
            if(verbose) {
                print.error('command: %s', cmd);
                print.error('adb stderr %s', stderr);
            }
            defer.reject('adb ' + err);
        }
        else {
            defer.resolve(device);
        }
    });

    return defer.promise;
};
