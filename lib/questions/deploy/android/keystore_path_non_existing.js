var pathHelper = require('../../../helper/path'),
    validator = require('../../../helper/validator'),
    validateFilePath = validator.toInquirerValidateƒ(validator.isNonExistingFilePath);

module.exports = {
    dependency: 'android',
    condition: function (answer) {
        return answer.deploy && !answer.keystore_reuse;
    },
    type: 'input',
    name: 'keystore_path',
    validate: validateFilePath,
    filter: function (answer) {
        return pathHelper.resolve(answer);
    },
    message: 'What shall be the path of the new keystore?'
};
