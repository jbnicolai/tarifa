var Q = require('q'),
    exec = require('child_process').exec,
    print = require('../../../../lib/helper/print'),
    path = require('path');

module.exports = function (device, verbose) {
    var defer = Q.defer();
    var app_path = path.join('app','platforms','wp8');
    var bin = path.join(__dirname, '..', '..', '..', '..', 'node_modules', 'cordova-deploy-windows-phone', 'CordovaDeploy', 'bin', 'Release','CordovaDeploy.exe');
    var cmd = bin + ' ' +  app_path + ' -d:' + device.index;
    var options = {
        timeout : 0,
        maxBuffer: 1024 * 400
    };

    if(verbose)
        print.success('start wp app install and run to device: %s');

    var child = exec(cmd, options, function (err, stdout, stderr) {
        if(err) {
            if(verbose) {
                print.error('command: %s', cmd);
                print.error('CordovaDeploy.exe stderr %s', stderr);
            }
            defer.reject('CordovaDeploy.exe ' + err);
            return;
        }
        defer.resolve();
    });

    if (verbose) child.stdout.pipe(process.stdout);

    return defer.promise;
};
