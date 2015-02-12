var Q = require('q'),
    os = require('os'),
    chalk = require('chalk'),
    exec = require('child_process').exec,
    print = require('../../../helper/print');

var info = function (verbose) {
    if (os.platform() !== 'darwin') return Q.resolve([]);
    var defer = Q.defer(),
        cmd = "system_profiler SPUSBDataType | sed -n -e '/iPad/,/Serial/p' -e '/iPhone/,/Serial/p' | grep \"Serial Number:\" | awk -F \": \" '{print $2}'";
    exec(cmd,
        function (error, stdout, stderr) {
            if (error !== null) {
                defer.reject(error);
            }
            else {
                defer.resolve(stdout.split('\n').filter(function(d) {return d.length > 0; }));
            }
    });
    return defer.promise;
};

var show = function (verbose) {
    return info(verbose).then(function (devices) {
        print(
            devices.length ? "%s\n\t%s" : "%s %s",
            chalk.green('connected iOS devices:'),
            devices.length ? devices.join('\n\t') : 'none'
        );
    });
};

module.exports = {
    info: info,
    print: show
};
