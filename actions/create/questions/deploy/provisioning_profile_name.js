var Q = require('q'),
    path = require('path'),
    askPassword = require('../../../config/ios/ask_password'),
    provisioningList = require('../../../../lib/ios/nomad/provisioning/list');

var question = function (response, verbose) {
    return askPassword().then(function (password) {
        response.password = password;
        var r = response;
        return provisioningList(r.apple_id, r.apple_developer_team, password, verbose)
            .then(function (profiles) {
                return {
                    dependency: 'ios',
                    type:'list',
                    name:'provisioning_profile_name',
                    choices: profiles.map(function (p) { return p[0].trim(); }),
                    message:'Which Provisioning profile do you take to build the adhoc distribution?'
                };
            });
    });
};

question.dependency = 'ios';
module.exports = question;
