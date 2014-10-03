var Q = require('q'),
    format = require('util').format,
    exec = require('child_process').exec,
    print = require('../../../../lib/helper/print'),
    pathHelper = require('../../../../lib/helper/path'),
    settings = require('../../../../lib/settings');

module.exports = function (conf) {
    var defer = Q.defer(),
        product_file_name = conf.localSettings.configurations['android'][conf.configuration].product_file_name,
        apk_filename_path = pathHelper.productFile('android', product_file_name),
        cmd = format(
            "%s -s %s install -rl %s",
            settings.external.adb.name,
            conf.device.value,
            apk_filename_path
        ),
        options = {
            timeout : 100000,
            maxBuffer: 1024 * 400
        };

    if(conf.verbose)
        print.success('trying to install android app: %s', product_file_name);

    exec(cmd, options, function (err, stdout, stderr) {
        if(conf.verbose && !! err && stdout) print('adb output %s', stdout);
        if(err) {
            if(conf.verbose) {
                print.error('command: %s', cmd);
                print.error('adb stderr %s', stderr);
            }
            defer.reject('adb command failed; try to plug again the device if the error persist.');
        }
        else {
            defer.resolve(conf);
        }
    });

    return defer.promise;
};
