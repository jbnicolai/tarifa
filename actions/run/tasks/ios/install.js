var Q = require('q'),
    pathHelper = require('../../../../lib/helper/path'),
    print = require('../../../../lib/helper/print'),
    exec = require('child_process').exec,
    path = require('path');

var install = function (conf, device) {
    var defer = Q.defer();
    var product_name = conf.localSettings.configurations['ios'][conf.configuration].product_name;
    var app_path = path.join(pathHelper.app(), 'platforms/ios/build/device', product_name + '.app');
    var bin = path.join(__dirname, '..', '..', '..', '..', 'node_modules', 'ios-deploy', 'ios-deploy');
    var cmd = bin + ' --justlaunch --debug --id ' + device + ' --bundle "' + app_path + '" --verbose';
    var options = {
        // don't kill the ios-deploy process
        timeout : 0,
        maxBuffer: 1024 * 1000
    };

    if(conf.verbose)
        print.success('start ios app install %s to device %s', product_name, device);

    var child = exec(cmd, options, function (err, stdout, stderr) {
        if(err && err.code !== 253) {
            if(conf.verbose) {
                print.error('command: %s', cmd);
                print.error('ios-deploy stderr %s', stderr);
            }
            defer.reject('ios-deploy ' + err);
            return;
        }
        defer.resolve(conf);
    });

    if (conf.verbose) child.stdout.pipe(process.stdout);

    return defer.promise;
};

module.exports = function (conf) {
    if(conf.device) {
        return install(conf, conf.device.value);
    } else {
        return conf.devices.reduce(function (promise, device) {
            return promise.then(function (c) { return install(c, device); });
        }, Q.resolve(conf));
    }
};
