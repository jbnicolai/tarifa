var Q = require('q'),
    format = require('util').format,
    provisioningList = require('../../../ios/nomad/provisioning/list');

module.exports = function (type) {
    var name = format('%s_provisioning_profile_name', type),
        question = function (response, verbose) {
            var r = response;
            return provisioningList(r.apple_id, r.apple_developer_team, r.password, verbose)
                .then(function (profiles) {
                    return {
                        dependency: 'ios',
                        type: 'list',
                        name: name,
                        choices: profiles.map(function (p) { return p[0].trim(); }),
                        message:format('Which Provisioning profile do you take to build the %s distribution?', type)
                    };
                });
        };
    question.dependency = 'ios';
    return question;
};
