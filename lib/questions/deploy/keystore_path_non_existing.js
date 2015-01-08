var pathHelper = require('../../../lib/helper/path'),
    validator = require('../../../lib/helper/validator'),
    validateFilePath = validator.toInquirerValidateƒ(validator.isNonExistingFilePath);

module.exports = {
    dependency: 'android',
    type: 'input',
    name: 'keystore_path',
    validate: validateFilePath,
    filter: function (answer) {
        return pathHelper.resolve(answer);
    },
    message: 'What shall be the path of the new keystore?'
};
