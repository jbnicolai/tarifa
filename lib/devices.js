var Q = require('q'),
    os = require('os'),
    exec = require('child_process').exec;

var getiOSDevices = function getiOSDevices() {
    if (os.platform() !== 'darwin') return Q.resolve([]);
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

var parseAndroidDevices = function(str) {
    return str.replace('List of devices attached', '')
        .replace(/\*.*\*/g, '')
        .split('\n')
        .filter(function (l) { return l.replace('\t', '').trim().length > 0; })
        .map(function (d) {
            return d.split(' ').filter(function (w) {
                return w.length > 0;
            });
        }).filter(function(d) { return d.length > 0; });
};

var getAndroidDevicesWithInfo = function getAndroidDevicesWithInfo() {
    var defer = Q.defer();
    exec("adb devices -l",
        function (error, stdout, stderr) {
            if (error !== null) defer.reject(error);
            else
                defer.resolve(parseAndroidDevices(stdout.toString()));
    });
    return defer.promise;
};

var getAndroidDevices = function getAndroidDevices() {
    return getAndroidDevicesWithInfo().then(function (devices) {
        return devices.map(function (device) { return device[0]; });
    });
};

var parserCordovaDeployDevicesOutput = function (str) {
    return str.split('\n')
        .filter(function (l) { return l.trim().length > 0; })
        .filter(function (l) { return l.split(':').length === 3; })
        .filter(function (l) { return l.split(':')[2].trim() === 'Device'; })
        .map(function (l) { return l.split(':')[1].trim(); });
};

var getWPDevices = function getWPDevices() {
    if (os.platform() !== 'win32') return Q.resolve([]);
    var defer = Q.defer();
    exec("cordovadeploy -devices",
        function (error, stdout, stderr) {
            if (error !== null)
                defer.reject(error);
            else
                defer.resolve(parserCordovaDeployDevicesOutput(stdout.toString()));
    });
    return defer.promise;
};

module.exports = {
    ios : getiOSDevices,
    android : getAndroidDevices,
    wp8: getWPDevices,
    androidVerbose: getAndroidDevicesWithInfo
};