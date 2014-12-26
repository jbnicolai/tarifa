var Q = require('q'),
    format = require('util').format,
    exec = require('child_process').exec,
    print = require('../helper/print');

module.exports.check = function (file_path, verbose) {
    var d = Q.defer(),
        cmd = format('keytool -list -keystore %s', file_path),
        opt = {
            cwd: null,
            env: null,
            timeout: 3 * 1000
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

module.exports.create = function (path, storepass, alias, keypass, commonName, verbose) {
    var d = Q.defer(),
        cmd = format('keytool -genkeypair -keystore "%s" -storepass %s -alias %s -keypass %s -dname "CN=%s"',
                     path,
                     storepass,
                     alias,
                     keypass,
                     commonName),
        options = {
            cwd: null,
            env: null,
            timeout: 3 * 1000
        };
    exec(cmd, options, function (error, stdout, stderr) {
        if (error) {
            if (verbose) print.error(format('cmd: %s', cmd));
            d.reject(stdout);
        } else {
            d.resolve(stdout);
        }
    });
    return d.promise;
};

module.exports.list = function (path, storepass, verbose) {
    var keytool = function () {
        var d = Q.defer(),
            cmd = format('keytool -list -keystore %s -storepass %s', path, storepass),
            options = {
                cwd: null,
                env: null,
                timeout: 3 * 1000
            };
        exec(cmd, options, function (error, stdout, stderr) {
            if (error) {
                if (verbose) print.error(format('cmd: %s', cmd));
                d.reject(stdout);
            } else {
                d.resolve(stdout);
            }
        });
        return d.promise;
    },
    parse = function (stdout) {
        var regex = /^(\w+),.*PrivateKeyEntry/gm,
            aliases = [],
            matches;
        while ((matches = regex.exec(stdout)) !== null)
            aliases.push(matches[1]);
        return aliases;
    };
    return keytool().then(parse);
};
