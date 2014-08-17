var Q = require('q'),
    chalk = require('chalk'),
    exec = require('child_process').exec;

module.exports = function (verbose) {
    var defer = Q.defer(),
        cmd = 'security find-identity |  sed -n \'s/.*\\("[^"]*"\\).*/\\1/p\' | grep \'iPhone\'',
        options = {
            timeout : 6000,
            maxBuffer: 1024 * 400
        },
        child = exec(cmd, options, function (err, stdout, stderr) {
            if(err) {
                if(verbose) {
                    console.log(chalk.red('command: ' + cmd));
                    console.log('Error: ' + stderr);
                }
                if(err.code === 1)
                    defer.reject('No Apple Developer Identity');
                else
                    defer.reject(err);
                return;
            }
            var rslt = stdout.toString()
                            .replace(/"/g, '')
                            .split('\n')
                            .filter(function (id) { return id.length > 0; });

            defer.resolve(rslt);
        });

    return defer.promise;
};
