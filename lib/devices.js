var Q = require('q'),
    exec = require('child_process').exec;

var getiOSDevices = function getiOSDevices() {
    var defer = Q.defer();
    exec("system_profiler SPUSBDataType | sed -n -e '/iPad/,/Serial/p' -e '/iPhone/,/Serial/p' | grep \"Serial Number:\" | awk -F \": \" '{print $2}'",
        function (error, stdout, stderr) {
            if (error !== null) defer.reject(error);
            else defer.resolve(stdout.split('\n'));
    });
    return defer.promise;
};

var getAndroidDevices = function getAndroidDevices() {
    var defer = Q.defer();
    exec("adb devices",
        function (error, stdout, stderr) {
            if (error !== null) defer.reject(error);
            else defer.resolve(stdout);
    });
    return defer.promise;
};

module.exports = {
    ios : getiOSDevices,
    android : getAndroidDevices
};
