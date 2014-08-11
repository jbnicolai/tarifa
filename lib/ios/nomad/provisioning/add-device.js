var Q = require('q'),
    format = require('util').format,
    exec = require('child_process').exec,
    parseProvisionFile = require('../../parse-mobileprovision');

function addDeviceToProvisioningProfile(user, team, password, uuid, profile_path, devices, verbose) {
    return parseProvisionFile(profile_path).then(function (provisioning) {
        var defer = Q.defer(),
            options = {
                timeout : 40000,
                maxBuffer: 1024 * 400
            },
            t = (team ?  (" --team " + team) : ''),
            device = devices.filter(function (d) { return d.uuid.trim() === uuid; } )[0],
            cmd = format(
                "ios profiles:manage:devices:add %s \"%s\"=%s -u %s -p %s %s",
                provisioning.name,
                device.name.trim(),
                uuid,
                user,
                password,
                t
            );

        exec(cmd, options, function (err, stdout, stderr) {
            if(err) {
                if(verbose) {
                    print.error('command: %s', cmd);
                }
                defer.reject('ios stderr ' + err);
                return;
            }

            var output = stdout.toString().split('\n');
            if(verbose) print(output.toString());
            defer.resolve(output.toString());
        });

        return defer.promise;
    });
}

module.exports = addDeviceToProvisioningProfile;
