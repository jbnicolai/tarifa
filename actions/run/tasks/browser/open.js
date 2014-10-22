var Q = require('q'),
    format = require('util').format,
    exec = require('child_process').exec,
    path = require('path'),
    print = require('../../../../lib/helper/print'),
    pathHelper = require('../../../../lib/helper/path'),
    settings = require('../../../../lib/settings');

module.exports = function (conf) {
    var defer = Q.defer(),
        cmd = path.join('platforms', 'browser', 'cordova', 'run'),
        options = {
            cwd:settings.cordovaAppPath,
            timeout : 100000,
            maxBuffer: 1024 * 400
        };

    if(conf.verbose)
        print.success('trying to open browser!');

    exec(cmd, options, function (err, stdout, stderr) {
        if(err) {
            if(conf.verbose) {
                print.error('command: %s', cmd);
                print.error('stderr %s', stderr);
            }
            defer.reject(cmd + ' command failed;');
        }
        else {
            defer.resolve(conf);
        }
    });

    return defer.promise;
};
