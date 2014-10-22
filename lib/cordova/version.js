var Q = require('q'),
    path = require('path'),
    exec = require('child_process').exec;

function getPlatformVersion(root) {
    return function (platform) {
        var cmd = path.join(root, 'platforms', platform, 'cordova', 'version'),
            defer = Q.defer(),
            options = {
                timeout : 0,
                maxBuffer: 1024 * 500
            },
            child = exec(cmd, options, function (err, stdout, stderr) {
                if(err) {
                    defer.reject(cmd + ' ' + err);
                    return;
                }
                var rslt = {
                    version : stdout.toString().replace(/\n/g, '').trim(),
                    name: platform
                };
                defer.resolve(rslt);
            });
        return defer.promise;
    };
}

function getCordovaPlatformsVersion(root, platforms) {
    return Q.all(platforms.map(getPlatformVersion(root)));
}

module.exports.getCordovaPlatformsVersion = getCordovaPlatformsVersion;
