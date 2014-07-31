var Q = require('q'),
    chalk = require('chalk'),
    exec = require('child_process').exec,
    path = require('path');

module.exports = function (deviceIndex, verbose) {
    var defer = Q.defer();
    var app_path = path.join('app','platforms','wp8');
    var bin = path.join(__dirname, '..', '..', '..', '..', 'node_modules', 'cordova-deploy-windows-phone', 'CordovaDeploy', 'bin', 'Release','CordovaDeploy.exe');
    var cmd = bin + ' ' +  app_path + ' -d:' + deviceIndex;
    var options = {
        timeout : 0,
        maxBuffer: 1024 * 400
    };

    if(verbose)
        console.log(chalk.green('✔') + ' start wp app install and run to device: ' + deviceIndex);

    var child = exec(cmd, options, function (err, stdout, stderr) {
        if(err) {
            if(verbose) {
                console.log(chalk.red('command: ' + cmd));
                console.log('CordovaDeploy.exe stderr ' + stderr);
            }
            defer.reject('CordovaDeploy.exe ' + err);
            return;
        }
        defer.resolve();
    });

    if (verbose) child.stdout.pipe(process.stdout);

    return defer.promise;
};