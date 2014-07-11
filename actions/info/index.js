var Q = require('q'),
    chalk = require('chalk'),
    exec = require('child_process').exec,
    pkg = require('../../package.json');

function printiOSDevices() {
    var defer = Q.defer();
    exec("system_profiler SPUSBDataType | sed -n -e '/iPad/,/Serial/p' -e '/iPhone/,/Serial/p' | grep \"Serial Number:\" | awk -F \": \" '{print $2}'",
        function (error, stdout, stderr) {
            if (error !== null) defer.reject(error);
            else defer.resolve(stdout);
    });
    return defer.promise;
};

function printAndroidDevices() {
    var defer = Q.defer();
    exec("adb devices",
        function (error, stdout, stderr) {
            if (error !== null) defer.reject(error);
            else defer.resolve(stdout);
    });
    return defer.promise;
};

module.exports = function (argv) {

        console.log(chalk.green('node version:               ') + process.versions.node);
        console.log(chalk.green('cordova version:            ') + pkg.dependencies.cordova);

    return printiOSDevices().then(function (devices) {
        console.log(chalk.green('connected iOS devices:      ') +  devices.replace('\n', ''));
    }).then(printAndroidDevices).then(function (devices) {
        var out = devices.replace('List of devices attached', '').replace('\t', ' ').replace('\n', '');
        console.log(chalk.green('connected Android devices: ') +  out);
    });

    // check installed xcode version if available
    // check android sdk version
    // check if we are in a tarifa project
    return Q.resolve();
};
