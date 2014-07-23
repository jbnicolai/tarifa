var Q = require('q'),
    exec = require('child_process').exec;

var getiOSDevices = function getiOSDevices() {
    var defer = Q.defer(),
        cmd = "system_profiler SPUSBDataType | sed -n -e '/iPad/,/Serial/p' -e '/iPhone/,/Serial/p' | grep \"Serial Number:\" | awk -F \": \" '{print $2}'";
    exec(cmd,
        function (error, stdout, stderr) {
            if (error !== null) {
                defer.reject(error);
            }
            else {
                defer.resolve(stdout.split('\n').filter(function(d) {return d.length > 0; }));
            }
    });
    return defer.promise;
};

var getAndroidDevicesWithInfo = function getAndroidDevicesWithInfo() {
    var defer = Q.defer();
    exec("adb devices -l",
        function (error, stdout, stderr) {
            if (error !== null) { defer.reject(error); }
            else {
                var out = stdout.toString()
                            .replace('List of devices attached', '')
                            .replace(/\*.*\*/g, '');
                var rslt = out.split('\n')
                            .map(function (d) {
                                return d.split(' ').filter(function (w) {
                                    return w.length > 0;
                                });
                            }).filter(function(d) { return d.length > 0; });
                defer.resolve(rslt);
            }
    });
    return defer.promise;
};

var getAndroidDevices = function getAndroidDevices() {
    return getAndroidDevicesWithInfo().then(function (devices) {
        return devices.map(function (device) { return device[0]; });
    });
};

module.exports = {
    ios : getiOSDevices,
    android : getAndroidDevices,
    androidVerbose: getAndroidDevicesWithInfo
};
