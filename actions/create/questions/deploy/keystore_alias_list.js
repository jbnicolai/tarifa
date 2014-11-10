var getAliases = require('../../../../lib/android/keystore').list;

var question = function (response, verbose) {
    return getAliases(response.keystore_path, response.keystore_storepass, verbose).then(function (aliases) {
        return {
            dependency: 'android',
            type: 'list',
            name: 'keystore_alias',
            choices: aliases,
            message: 'Which alias would you like to use?'
        };
    });
};

question.dependency = 'android';
module.exports = question;
