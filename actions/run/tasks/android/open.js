var Q = require('q'),
    exec = require('child_process').exec,
    settings = require('../../../../lib/settings');

module.exports = function (localSettings, config, verbose) {
    var defer = Q.defer();
    var name = localSettings.configurations['android'][config].name;
    var cmd = settings.external.adb.name
        + ' shell am start '
        + localSettings.configurations['android'][config].id
        + '/'+ localSettings.configurations['android'][config].id
        + '.' + name;

    var options = {
        timeout : 6000,
        maxBuffer: 1024 * 400
    };

    exec(cmd, options, function (err, stdout, stderr) {
        if(verbose && !! err && stdout) console.log('adb output ' + stdout);
        if(err) {
            if(verbose) console.log('adb stderr ' + stderr);
            return defer.reject('adb ' + err);
        }
        else defer.resolve();
    });

    return defer.promise;
};
