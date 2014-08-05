var path = require('path'),
    Q = require('q'),
    path = require('path'),
    downloadProvisioningProfile = require('../../config/ios/provisioning').downloadProvisioningProfile,
    settings = require('../../../lib/settings');

module.exports = function (response) {
    if(!response.provisioning_profile_path || !response.provisioning_profile_name) {
        return Q.resolve(response);
    }

    return downloadProvisioningProfile(
        response.apple_id,
        response.apple_developer_team,
        response.password,
        response.provisioning_profile_name,
        path.resolve(response.path, response.provisioning_profile_path),
        response.options.verbose
    ).then(function () { return response; });
};
