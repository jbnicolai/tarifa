var Q = require('q'),
    path = require('path'),
    print = require('../../../lib/helper/print'),
    pathHelper = require('../../../lib/helper/path'),
    download = require('../../../lib/ios/nomad/provisioning/download'),
    install = require('../../../lib/ios/nomad/provisioning/install');

module.exports = function (r) {
    if (!r.provisioning_profile_name) return Q.resolve(r);

    var downloadDest = pathHelper.resolve(r.path, 'downloaded.mobileprovision');
    return download(
        r.apple_id,
        r.apple_developer_team,
        r.password,
        r.provisioning_profile_name,
        downloadDest,
        r.options.verbose
    ).then(function () {
        return install(
            downloadDest,
            false, // do not remove the downloaded.mobileprovision file after install
            r.options.verbose
        );
    }).then(function () {
        r.provisioning_profile_path = downloadDest;
        return r;
    });
};
