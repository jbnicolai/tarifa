var Q = require('q'),
    path = require('path'),
    fs = require('q-io/fs'),
    format = require('util').format,
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings');

function rename(src, dest) {
    return function () { fs.rename(src, dest); };
}

module.exports = function (msg) {
    var localeConf = msg.localSettings.configurations.windows8,
        filename = msg.localSettings.configurations.windows8[msg.configuration].product_file_name,
        release = msg.localSettings.mode === '--release',
        version = (msg.localSettings.configurations.windows8[msg.configuration].version || msg.localSettings.version) + '.0',
        defaultFilename = format("%s_%s_%s_%s", 'CordovaApp', version, 'AnyCPU', release ? 'Test': 'Debug_Test'),
        defaultFilenameAppx = format("%s_%s_%s%s", 'CordovaApp', version, 'AnyCPU', release ? '': '_Debug'),
        newFilename = format("%s.%s.%s", filename, msg.configuration, version),
        dir = path.join(settings.cordovaAppPath, 'platforms', 'windows8', 'AppPackages'),
        src1 = path.join(dir, defaultFilename),
        target1 = path.join(dir, newFilename),
        src2 = path.join(dir, defaultFilenameAppx + '.appxupload'),
        target2 = path.join(dir, newFilename + '.appxupload');

    return Q.all([fs.remove(target1), fs.remove(target2)])
        .then(rename(src1, target1), rename(src1, target1))
        .then(function () { if(msg.verbose) print.success('rename generated app'); })
        .then(rename(src2, target2), rename(src2, target2))
        .then(function () { if(msg.verbose) print.success('rename generated .appxupload generated file'); })
        .then(function () { return msg; });
};