var Q = require('q'),
    format = require('util').format,
    exec = require('child_process').exec,
    print = require('../helper/print');

module.exports.check = function check (file_path, verbose) {
    var d = Q.defer(),
        cmd = format('keytool -list -keystore %s', file_path),
        opt = {
            cwd: null,
            env: null,
            timeout: 5 * 1000
        };
    exec(cmd, opt, function (error, stdout, stderr) {
        if(error && !error.killed) {
            if(verbose) {
                print.error(format('cmd: %s', cmd));
            }
            d.reject(stdout.replace('\n', ''));
            return;
        }
        d.resolve();
    });
    return d.promise;
};
