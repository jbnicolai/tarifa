var Q = require('q'),
    format = require('util').format,
    exec = require('child_process').exec;

function addDevice(user, team, password, name, uuid, verbose) {
    var defer = Q.defer(),
        options = {
            timeout : 40000,
            maxBuffer: 1024 * 400
        },
        t = (team ?  (" --team " + team) : ''),
        cmd = format("ios devices:add %s=%s -u %s -p %s %t", name, uuid, user, password, t);

    exec(cmd, options, function (err, stdout, stderr) {
        if(err) {
            if(verbose) {
                print.error('command: %s', cmd);
            }
            defer.reject('ios stderr ' + err);
            return;
        }
        defer.resolve(stdout.toString());
    });
    return defer.promise;
}

module.exports = addDevice;
