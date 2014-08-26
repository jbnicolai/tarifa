var Q = require('q'),
    path = require('path'),
    ncp = require('ncp').ncp,
    fs = require('q-io/fs'),
    format = require('util').format,
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings');

function copy(src, dest) {
    return function () {
        var defer = Q.defer();
        ncp.limit = 1024;
        ncp(src, dest, function (err) {
            if (err) return defer.reject(err);
            defer.resolve();
        });
        return defer.promise;
    };
}

module.exports = function (msg) {
    var localeConf = msg.localSettings.configurations.windows8,
        filename = localeConf[msg.configuration].product_file_name,
        release = msg.localSettings.mode === '--release',
        version = (localeConf[msg.configuration].version || msg.localSettings.version) + '.0',
        defaultFilename = format("%s_%s_%s_%s", 'CordovaApp', version, 'AnyCPU', release ? 'Test': 'Debug_Test'),
        defaultFilenameAppx = format("%s_%s_%s%s", 'CordovaApp', version, 'AnyCPU', release ? '': '_Debug'),
        newFilename = format("%s.%s.%s", filename, msg.configuration, version),
        dir = path.join(settings.cordovaAppPath, 'platforms', 'windows8', 'AppPackages'),
        src1 = path.join(dir, defaultFilename),
        target1 = path.join(dir, newFilename),
        src2 = path.join(dir, defaultFilenameAppx + '.appxupload'),
        target2 = path.join(dir, newFilename + '.appxupload');

    return Q.all([fs.remove(target1), fs.remove(target2)])
        .then(copy(src1, target1), copy(src1, target1))
        .then(function () { if(msg.verbose) print.success('copy generated app'); })
        .then(copy(src2, target2), copy(src2, target2))
        .then(function () { if(msg.verbose) print.success('copy generated .appxupload generated file'); })
        .then(function () { return msg; });
};