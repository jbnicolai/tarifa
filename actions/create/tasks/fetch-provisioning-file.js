var path = require('path'),
    Q = require('q'),
    path = require('path'),
    print = require('../../../lib/helper/print'),
    download = require('../../../lib/ios/nomad/provisioning/download'),
    settings = require('../../../lib/settings');

module.exports = function (r) {
    if(!r.provisioning_profile_path || !r.provisioning_profile_name) {
        return Q.resolve(r);
    }

    return download(
        r.apple_id,
        r.apple_developer_team,
        r.password,
        r.provisioning_profile_name,
        path.resolve(r.path, r.provisioning_profile_path),
        r.options.verbose
    ).then(function () {
        if (r.options.verbose)
            print.warning("You need to click on the provisioning file to add it to the iPhone Configuration Utility");
        return r;
    });
};
