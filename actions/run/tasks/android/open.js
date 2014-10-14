var Q = require('q'),
    exec = require('child_process').exec,
    print = require('../../../../lib/helper/print'),
    inferJavaClassNameFromProductName = require('../../../../lib/android/infer-classname'),
    settings = require('../../../../lib/settings');

var open = function (conf, device) {
    var defer = Q.defer();
    var name = inferJavaClassNameFromProductName(conf.localSettings.configurations['android'][conf.configuration].product_name);
    var activity = conf.localSettings.configurations['android'][conf.configuration].id + '.' + name;
    var cmd = settings.external.adb.name
        + ' -s ' + device
        + ' shell am start '
        + conf.localSettings.configurations['android'][conf.configuration].id
        + '/'+ activity;

    var options = {
        timeout : 10000,
        maxBuffer: 1024 * 400
    };

    if(conf.verbose)
        print.success('trying to open android app with activity %s on %s', activity, device);

    exec(cmd, options, function (err, stdout, stderr) {
        if(conf.verbose && !! err && stdout) print('adb output %s', stdout);
        if(err) {
            if(conf.verbose) {
                print.error('command: %s', cmd);
                print.error('adb stderr %s', stderr);
            }
            return defer.reject('adb ' + err);
        }
        else defer.resolve(conf);
    });

    return defer.promise;
}

module.exports = function (conf) {
    if(conf.device) {
        return open(conf, conf.device.value);
    } else {
        return conf.devices.reduce(function (promise, device) {
            return promise.then(function (c) { return open(c, device); });
        }, Q.resolve(conf));
    }
};
