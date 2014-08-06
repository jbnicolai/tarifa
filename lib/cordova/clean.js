var Q = require('q'),
    path = require('path'),
    chalk = require('chalk'),
    exec = require('child_process').exec,
    os = require('os'),
    settings = require('../settings');

function clean(platform, verbose) {
    return function () {
        if(platform === 'web') return Q.resolve();
        var defer = Q.defer(),
            cmd = os.platform() === 'win32' ? 'clean' : './clean',
            cwd = path.join(process.cwd(), settings.cordovaAppPath, 'platforms', platform, 'cordova'),
            options = {
                cwd: cwd,
                timeout : 0,
                maxBuffer: 1024 * 4000
            };

        var child = exec(cmd, options, function (err, stdout, stderr) {
            if(err) {
                if(verbose) {
                    console.log(chalk.red('command: clean'));
                    console.log('command stderr ' + stderr);
                }
                defer.reject('command stderr ' + err);
                return;
            }
            if(verbose)
                console.log(chalk.green('✔') + ' cleaning platform ' + platform);
            defer.resolve();
        });

        if (verbose) child.stdout.pipe(process.stdout);

        return defer.promise;
    }
};

module.exports = function (platforms, verbose) {
    return platforms.reduce(function (promise, platform) {
        return promise.then(clean(platform, verbose));
    }, Q.resolve());
};
