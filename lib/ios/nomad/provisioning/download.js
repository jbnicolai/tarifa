var Q = require('q'),
    tmp = require('tmp'),
    format = require('util').format,
    ncp = require('ncp').ncp,
    exec = require('child_process').exec,
    path = require('path'),
    print = require('../../../helper/print');

function download(user, team, password, name, profile_path, verbose) {
    var defer = Q.defer(),
        t = (team ?  (" --team " + team) : ''),
        cmd = format("ios profiles:download %s -u %s -p %s %s --type distribution", name,  user, password, t);

    tmp.dir(function _tempDirCreated(err, tmppath) {
        if (err) return defer.reject('Error while downloading provisioning file: ' + err);

        var options = {
            cwd: tmppath,
            timeout : 40000,
            maxBuffer: 1024 * 400
        };

        exec(cmd, options, function (err, stdout, stderr) {
            if(err) {
                if(verbose) {
                    print.error('command: %s', cmd);
                }
                defer.reject('ios stderr ' + err);
                return;
            }
            if (verbose) print.success('try to copy provision');
            ncp.limit = 1;
            ncp(path.join(tmppath, name.replace(/-/g,'').replace(/ /g, '_') + '.mobileprovision'), profile_path, function (err) {
                if (err) return defer.reject(err);
                if (verbose) print.success('provisioning profile fetched');
                var output = stdout.toString();
                defer.resolve(output);
            });
        });
    });

    return defer.promise;
}

module.exports = download;
