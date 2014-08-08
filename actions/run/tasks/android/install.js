var Q = require('q'),
    format = require('util').format,
    exec = require('child_process').exec,
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings');

module.exports = function (conf) {
    var defer = Q.defer(),
        mode = conf.localSettings.mode ? '-release.apk' : '-debug.apk',
        product_name = conf.localSettings.configurations['android'][conf.configuration].product_file_name,
        apk_filename = product_name + mode,
        cmd = format(
            "%s -s %s install -rl app/platforms/android/ant-build/%s",
            settings.external.adb.name,
            conf.device.value,
            apk_filename
        ),
        options = {
            timeout : 10000,
            maxBuffer: 1024 * 400
        };

    if(conf.verbose)
        print.success('trying to install android app: %s', apk_filename);

    exec(cmd, options, function (err, stdout, stderr) {
        if(conf.verbose && !! err && stdout) print('adb output %s', stdout);
        if(err) {
            if(conf.verbose) {
                print.error('command: %s', cmd);
                print.error('adb stderr %s', stderr);
            }
            defer.reject('adb ' + err);
        }
        else {
            defer.resolve(conf);
        }
    });

    return defer.promise;
};
