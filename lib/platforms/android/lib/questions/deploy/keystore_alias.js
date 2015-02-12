var validator = require('../../../../../helper/validator'),
    validateKeystoreAlias = validator.toInquirerValidateƒ(validator.isKeystoreAlias);

module.exports = {
    dependency: 'android',
    condition: function (answer) {
        return answer.deploy && !answer.keystore_reuse;
    },
    type: 'input',
    name: 'keystore_alias',
    validate: validateKeystoreAlias,
    message: 'What is the alias?'
};
