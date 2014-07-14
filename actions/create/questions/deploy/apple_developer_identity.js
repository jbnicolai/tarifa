var Q = require('q'),
    chalk = require('chalk'),
    exec = require('child_process').exec,
    getAppleDeveloperIdentities = require('../../../../lib/apple_developer_identity');

var question = function (verbose) {
    return getAppleDeveloperIdentities(verbose).then(function (identities) {
        return {
            dependency: 'ios',
            type:'list',
            name:'apple_developer_identity',
            choices: identities,
            default: 0,
            message:'Which Developer Identity do you take to build the adhoc distribution?'
        };
    });
};

question.dependency = 'ios';
module.exports = question;
