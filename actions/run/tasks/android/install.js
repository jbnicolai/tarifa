var Q = require('q'),
    exec = require('child_process').exec,
    chalk = require('chalk'),
    settings = require('../../../../lib/settings');

module.exports = function (localSettings, config, device, verbose) {
    var defer = Q.defer();
    var mode = localSettings.mode ? '-release.apk' : '-debug.apk';
    var apk_filename = localSettings.configurations['android'][config].product_file_name + mode;
    var cmd = settings.external.adb.name + ' -s ' + device + ' install -rl ' + 'app/platforms/android/ant-build/' + apk_filename;
    var options = {
        timeout : 6000,
        maxBuffer: 1024 * 400
    };

    if(verbose)
        console.log(chalk.green('✔') + ' trying to install android app: ' + apk_filename);

    exec(cmd, options, function (err, stdout, stderr) {
        if(verbose && !! err && stdout) console.log('adb output ' + stdout);
        if(err) {
            if(verbose) {
                console.log(chalk.red('command: ' + cmd));
                console.log('adb stderr ' + stderr);
            }
            defer.reject('adb ' + err);
        }
        else {
            defer.resolve(device);
        }
    });

    return defer.promise;
};
