var Q = require('q'),
    chalk = require('chalk'),
    exec = require('child_process').exec,
    settings = require('../../../../lib/settings'),
    getAppleDeveloperIdentities = require('../../../../lib/ios/apple_developer_identity');

var question = function (response, verbose) {
    return getAppleDeveloperIdentities(verbose).then(function (identities) {
        var ids = identities;
        ids.push(settings.default_apple_developer_identity);
        return {
            dependency: 'ios',
            type:'list',
            name:'apple_developer_identity',
            choices: ids,
            default: settings.default_apple_developer_identity,
            message:'Which Developer Identity do you take to build the adhoc distribution?'
        };
    });
};

question.dependency = 'ios';
module.exports = question;
