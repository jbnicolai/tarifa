var Q = require('q'),
    chalk = require('chalk'),
    exec = require('child_process').exec,
    getIosDevice = require('../../../../lib/devices').ios,
    path = require('path');

module.exports = function (localSettings, config, verbose) {
    return getIosDevice().then(function (devices) {
        var defer = Q.defer();
        // FIXME take the fist connected ios devices for now
        // we should be able to choose...
        var uuid = devices[0];
        var product_name = localSettings.configurations['ios'][config].product_file_name;
        var app_path = path.join('app/platforms/ios/build/device', product_name + '.app');
        var bin = path.join(__dirname, '..', '..', '..', '..', 'node_modules', 'ios-deploy', 'ios-deploy');
        var cmd = bin + ' -r -I -i ' + uuid + ' -b ' + app_path + ' --verbose';
        var options = {
            // don't kill the ios-deploy process
            timeout : 0,
            maxBuffer: 1024 * 400
        };

        if(verbose)
            console.log(chalk.green('✔') + ' start ios app install to device: ' + uuid);

        exec(cmd, options, function (err, stdout, stderr) {
            if(err) {
                if(verbose) {
                    console.log(chalk.red('command: ' + cmd));
                    console.log('ios-deploy stderr ' + stderr);
                }
                defer.reject('ios-deploy ' + err);
                return;
            }
            if(verbose && stdout) console.log(stdout.toString());
            defer.resolve();
        });
        return defer.promise;
    });
};
