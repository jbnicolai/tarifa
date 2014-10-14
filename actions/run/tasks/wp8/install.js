var Q = require('q'),
    exec = require('child_process').exec,
    format = require('util').format,
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings'),
    path = require('path');

var install = function (conf, deviceIndex) {
    var defer = Q.defer(),
        app_path = path.join('app','platforms','wp8'),
        cmd = format("%s %s -d:%d", settings.external.cordovadeploy.name, app_path,  deviceIndex),
        options = {
            timeout : 0,
            maxBuffer: 1024 * 400
        };
    if(conf.verbose)
        print.success('start wp app install and run to device index %s', deviceIndex);

    var child = exec(cmd, options, function (err, stdout, stderr) {
        if(err) {
            if(conf.verbose) {
                print.error('command: %s', cmd);
                print.error('CordovaDeploy.exe stderr %s', stderr);
            }
            defer.reject('CordovaDeploy.exe ' + err);
            return;
        }
        if (conf.verbose) {
            var er = stderr.toString().trim();
            if(er) print.warning("CordovaDeploy.exe failed with %s", er);
            if(er === 'Error :: 0x89740006')
                print.warning("Too many developer apps installed!");
        }
        defer.resolve(conf);
    });

    if (conf.verbose) child.stdout.pipe(process.stdout);

    return defer.promise;
};

module.exports = function (conf) {
    if(conf.device) {
        return install(conf, conf.device.index);
    } else {
        return conf.devices.reduce(function (promise, device, idx) {
            return promise.then(function (c) { return install(c, idx); });
        }, Q.resolve(conf));
    }
};
