var Q = require('q'),
    path = require('path'),
    chalk = require('chalk'),
    fs = require('fs'),
    exec = require('child_process').exec,
    os = require('os'),
    print = require('../helper/print'),
    settings = require('../settings');

// TODO we need to do more, revove also all binary stuff and generated apps!
function clean(root, platform, verbose) {
    return function () {
        var defer = Q.defer(),
            cwd = path.resolve(root, settings.cordovaAppPath, 'platforms', platform, 'cordova'),
            cmd = path.resolve(cwd, 'clean'),
            options = {
                cwd: cwd,
                timeout : 0,
                maxBuffer: 1024 * 4000
            };

        if(!fs.existsSync(path.join(cwd, 'clean'))) return Q.resolve();

        var child = exec('node ' + cmd, options, function (err, stdout, stderr) {
            if(err) {
                if(verbose) {
                    print.error('command: clean');
                    print.error('command stderr ' + stderr);
                }
                defer.reject('command stderr ' + err);
                return;
            }
            if(verbose)
                print.success('cleaning platform %s', platform);
            defer.resolve();
        });

        if (verbose) child.stdout.pipe(process.stdout);

        return defer.promise;
    }
};

module.exports = function (root, platforms, verbose) {
    return platforms.reduce(function (promise, platform) {
        return promise.then(clean(root, platform, verbose));
    }, Q.resolve());
};
