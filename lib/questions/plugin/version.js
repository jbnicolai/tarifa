var validator = require('../../../lib/helper/validator'),
    validateVersion = validator.toInquirerValidateƒ(validator.isVersion);

module.exports = {
    type: 'input',
    name: 'version',
    validate: validateVersion,
    message: 'Choose a version number for your plugin',
    default: '1.0.0'
};
