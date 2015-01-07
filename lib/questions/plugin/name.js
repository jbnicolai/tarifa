var validator = require('../../../lib/helper/validator'),
    validateJavaIdentifier = validator.toInquirerValidateƒ(validator.isJavaIdentifier);

module.exports = {
    type: 'input',
    name: 'name',
    validate: validateJavaIdentifier,
    message: 'Type the human-readable name of your plugin'
};
