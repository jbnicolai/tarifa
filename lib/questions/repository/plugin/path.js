var validator = require('../../../../lib/helper/validator'),
    validatePluginPath = validator.toInquirerValidateƒ(validator.isNonExistingOrEmptyFolderPath);

module.exports = {
    type: 'input',
    name: 'path',
    validate: validatePluginPath,
    message: 'Where do you want to create your plugin?'
};
