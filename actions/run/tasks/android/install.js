var Q = require('q'),
    format = require('util').format,
    exec = require('child_process').exec,
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings');

module.exports = function (localSettings, config, device, verbose) {
    var defer = Q.defer(),
        mode = localSettings.mode ? '-release.apk' : '-debug.apk',
        product_name = localSettings.configurations['android'][config].product_file_name,
        cmd = format(
            "%s -s %s install -rl app/platforms/android/ant-build/%s",
            settings.external.adb.name,
            device.value,
            product_name + mode
        ),
        options = {
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
