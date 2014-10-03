var Q = require('q'),
    path = require('path'),
    fs = require('q-io/fs'),
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var out_dir = path.join(process.cwd(), settings.cordovaAppPath, 'platforms', 'android', 'build', 'apk');

    return fs.list(out_dir).then(function (files) {
        var apks = files.filter(function (file) { return file.match(/\.apk/); });
        return Q.all(apks.map(function (apk) { return path.resolve(out_dir, apk); }).map(fs.remove));
    }).then(function () {
        if(msg.verbose) print.success('clean apk output folder %s', out_dir);
        return msg;
    });
};
