var Q = require('q'),
    exec = require('child_process').exec,
    print = require('../../../../lib/helper/print'),
    inferJavaClassNameFromProductName = require('../../../../lib/android/infer-classname'),
    settings = require('../../../../lib/settings');

module.exports = function (localSettings, config, device, verbose) {
    var defer = Q.defer();
    var name = inferJavaClassNameFromProductName(localSettings.configurations['android'][config].product_name);
    var activity = localSettings.configurations['android'][config].id + '.' + name;
    var cmd = settings.external.adb.name
        + ' -s ' + device.value
        + ' shell am start '
        + localSettings.configurations['android'][config].id
        + '/'+ activity;

    var options = {
        timeout : 6000,
        maxBuffer: 1024 * 400
    };

    if(verbose)
        print.success('trying to open android app with activity %s', activity);

    exec(cmd, options, function (err, stdout, stderr) {
        if(verbose && !! err && stdout) print('adb output %s', stdout);
        if(err) {
            if(verbose) {
                print.error('command: %s', cmd);
                print.error('adb stderr %s', stderr);
            }
            return defer.reject('adb ' + err);
        }
        else defer.resolve();
    });

    return defer.promise;
};
