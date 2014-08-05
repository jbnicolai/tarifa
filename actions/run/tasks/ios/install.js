var Q = require('q'),
    print = require('../../../../lib/helper/print'),
    exec = require('child_process').exec,
    path = require('path');

module.exports = function (localSettings, config, device, verbose) {
    var defer = Q.defer();
    var product_name = localSettings.configurations['ios'][config].product_name;
    var app_path = path.join('app/platforms/ios/build/device', product_name.replace(/ /g, '\\ ') + '.app');
    var bin = path.join(__dirname, '..', '..', '..', '..', 'node_modules', 'ios-deploy', 'ios-deploy');
    var cmd = bin + ' -r -I -i ' + device.value + ' -b ' + app_path + ' --verbose';
    var options = {
        // don't kill the ios-deploy process
        timeout : 0,
        maxBuffer: 1024 * 400
    };

    if(verbose)
        print.success('start ios app install to device: %s', device.value);

    var child = exec(cmd, options, function (err, stdout, stderr) {
        if(err) {
            if(verbose) {
                print.error('command: %s', cmd);
                print.error('ios-deploy stderr %s', stderr);
            }
            defer.reject('ios-deploy ' + err);
            return;
        }
        defer.resolve();
    });

    if (verbose) child.stdout.pipe(process.stdout);

    return defer.promise;
};
