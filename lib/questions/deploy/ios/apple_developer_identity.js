var Q = require('q'),
    format = require('util').format,
    chalk = require('chalk'),
    settings = require('../../../settings'),
    identities = require('../../../ios/apple_developer_identity');

var msg = 'Which Developer Identity do you take to build the %s distribution?';

module.exports = function (type) {

    var question = function (response, verbose) {
        return identities(verbose).then(function (identities) {
            var ids = identities;
            ids.push(settings.default_apple_developer_identity);

            return {
                dependency: 'ios',
                type:'list',
                condition: function (answer) {
                    return answer.deploy;
                },
                name: format('%s_apple_developer_identity', type),
                choices: ids,
                default: settings.default_apple_developer_identity,
                message: format(msg, chalk.underline(type))
            };
        });
    };

    question.dependency = 'ios';

    return question;
};
