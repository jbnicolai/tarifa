var Q = require('q'),
    path = require('path'),
    fs = require('q-io/fs'),
    parseProvisionFile = require('../../parse-mobileprovision'),
    print = require('../../../helper/print');

module.exports = function (profilePath, remove, verbose) {
    var installationDirectory = path.join(
                                    process.env.HOME,
                                    'Library',
                                    'MobileDevice',
                                    'Provisioning Profiles'
                                );
    return parseProvisionFile(profilePath).then(function (parsed) {
        var uuid = parsed.uuid,
            target = path.join(installationDirectory, uuid + '.mobileprovision'),
            mkdir = fs.isDirectory(installationDirectory).then(function (exists) {
                return exists ? Q.resolve() : fs.makeTree(installationDirectory);
            });
        return mkdir.then(function () {
            return fs.copy(profilePath, target).then(function () {
                return target;
            });
        });
    }).then(function (target) {
        if (verbose) print.success('provisioning profile installed');
        return remove ? fs.remove(profilePath).then(function () {
            return target;
        }) : target;
    });
};
