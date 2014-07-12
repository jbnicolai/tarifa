var Q = require('q'),
    exec = require('child_process').exec,
    chalk = require('chalk'),
    settings = require('../../../../lib/settings');

module.exports = function (localSettings, config, verbose) {
    var defer = Q.defer();
    var name = localSettings.configurations['android'][config].name;
    var activity = localSettings.configurations['android'][config].id + '.' + name;
    var cmd = settings.external.adb.name
        + ' shell am start '
        + localSettings.configurations['android'][config].id
        + '/'+ activity;

    var options = {
        timeout : 6000,
        maxBuffer: 1024 * 400
    };

    if(verbose)
        console.log(chalk.green('✔') + ' trying to open android app with activity ' + activity);

    exec(cmd, options, function (err, stdout, stderr) {
        if(verbose && !! err && stdout) console.log('adb output ' + stdout);
        if(err) {
            if(verbose) {
                console.log(chalk.red('command: ' + cmd));
                console.log('adb stderr ' + stderr);
            }
            return defer.reject('adb ' + err);
        }
        else defer.resolve();
    });

    return defer.promise;
};
