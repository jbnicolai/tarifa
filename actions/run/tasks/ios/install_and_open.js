var Q = require('q'),
    exec = require('child_process').exec,
    getIosDevice = require('../../../../lib/devices').ios,
    path = require('path');

module.exports = function (localSettings, config, verbose) {
    return getIosDevice().then(function (devices) {
        var defer = Q.defer();
        // FIXME take the fist connected ios devices for now
        var uuid = devices[0];
        var product_name = localSettings.configurations['ios'][config].product_file_name;
        var app_path = path.join('app/platforms/ios/build/device', product_name + '.app');
        var cmd = 'ios-deploy -d -r -I -i ' + uuid + ' -b ' + app_path + ' --verbose';
        var options = {
            // don't kill the ios-deploy process
            timeout : 0,
            maxBuffer: 1024 * 400
        };

        exec(cmd, options, function (err, stdout, stderr) {
            if(verbose && !! err && stdout) console.log('ios-deploy output ' + stdout);
            if(err) {
                if(verbose) console.log('ios-deploy stderr ' + stderr);
                defer.reject('ios-deploy ' + err);
            }
            else {
                defer.resolve();
            }
        });
        return defer.promise;
    });
};
