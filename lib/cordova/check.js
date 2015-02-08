var Q = require('q'),
    path = require('path'),
    exec = require('child_process').exec,
    cordova_lazy_load = require('cordova-lib/src/cordova/lazy_load');

function requirements(platform) {
    return function (libPath) {
        var cmd = path.join(libPath, 'bin', 'check_reqs');
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
                defer.resolve();
            });

        return defer.promise;
    };
}

module.exports = function (platform) {
    return cordova_lazy_load.cordova(platform).then(requirements(platform));
};
