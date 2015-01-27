var validator = require('../../../helper/validator'),
    validateKeystorePassword = validator.toInquirerValidateƒ(validator.isKeystorePassword);

module.exports = {
    dependency: 'android',
    condition: function (answer) {
        return answer.deploy && !answer.keystore_reuse;
    },
    type: 'password',
    name: 'keystore_keypass',
    message: 'What is the keypass?',
    validate: validateKeystorePassword
};
