var validator = require('../../../helper/validator'),
    validateKeystorePassword = validator.toInquirerValidateƒ(validator.isKeystorePassword);

module.exports = {
    dependency: 'android',
    type: 'password',
    name: 'keystore_keypass',
    message: 'What is the keypass?',
    validate: validateKeystorePassword
};
