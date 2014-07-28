var Q = require('q'),
    chalk = require('chalk'),
    exec = require('child_process').exec,
    path = require('path');

module.exports = function (localSettings, config, uuid, verbose) {
    var defer = Q.defer();
    var product_name = localSettings.configurations['ios'][config].product_name;
    var app_path = path.join('app/platforms/ios/build/device', product_name.replace(/ /g, '\\ ') + '.app');
    var bin = path.join(__dirname, '..', '..', '..', '..', 'node_modules', 'ios-deploy', 'ios-deploy');
    var cmd = bin + ' -r -I -i ' + uuid + ' -b ' + app_path + ' --verbose';
    var options = {
        // don't kill the ios-deploy process
        timeout : 0,
        maxBuffer: 1024 * 400
    };

    if(verbose)
        console.log(chalk.green('✔') + ' start ios app install to device: ' + uuid);

    var child = exec(cmd, options, function (err, stdout, stderr) {
        if(err) {
            if(verbose) {
                console.log(chalk.red('command: ' + cmd));
                console.log('ios-deploy stderr ' + stderr);
            }
            defer.reject('ios-deploy ' + err);
            return;
        }
        defer.resolve();
    });

    if (verbose) child.stdout.pipe(process.stdout);

    return defer.promise;
};
