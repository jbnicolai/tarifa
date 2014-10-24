var Q = require('q'),
    path = require('path'),
    fs = require('q-io/fs'),
    rimraf = require('rimraf'),
    pathHelper = require('../../../../lib/helper/path'),
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var androidPath = path.join(pathHelper.app(), 'platforms', 'android'),
        out_dir = path.join(androidPath, 'build', 'apk'),
        res_dir = path.join(androidPath, 'build', 'res'),
        defer = Q.defer();

    rimraf(res_dir, function (err) {
        if(err) defer.reject(err);
        if(msg.verbose) print.success('clean res build folder %s', res_dir);
        defer.resolve();
    });

    return defer.promise.then(function () {
        return fs.list(out_dir).then(function (files) {
            var apks = files.filter(function (file) { return file.match(/\.apk/); });
            return Q.all(apks.map(function (apk) { return path.resolve(out_dir, apk); }).map(fs.remove));
        }).then(function () {
            if(msg.verbose) print.success('clean apk output folder %s', out_dir);
            return msg;
        }, function (err) {
            if (err.code === 'ENOENT') return msg;
            else return Q.reject(err);
        });
    });
};
