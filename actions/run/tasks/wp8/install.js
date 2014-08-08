var Q = require('q'),
    exec = require('child_process').exec,
    format = require('util').format,
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings'),
    path = require('path');

module.exports = function (conf) {
    var defer = Q.defer(),
        app_path = path.join('app','platforms','wp8'),
        cmd = format("%s %s -d:%d", settings.external.cordovadeploy.name, app_path,  conf.device.index),
        options = {
            timeout : 0,
            maxBuffer: 1024 * 400
        };

    if(conf.verbose)
        print.success('start wp app install and run to device: %s', conf.device.index);

    var child = exec(cmd, options, function (err, stdout, stderr) {
        if(err) {
            if(conf.verbose) {
                print.error('command: %s', cmd);
                print.error('CordovaDeploy.exe stderr %s', stderr);
            }
            defer.reject('CordovaDeploy.exe ' + err);
            return;
        }
        defer.resolve(conf);
    });

    if (conf.verbose) child.stdout.pipe(process.stdout);

    return defer.promise;
};
