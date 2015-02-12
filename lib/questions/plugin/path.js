var validator = require('../../../lib/helper/validator'),
    pathHelper = require('../../../lib/helper/path'),
    validatePluginPath = validator.toInquirerValidateƒ(validator.isNonExistingOrEmptyFolderPath);

module.exports = {
    type: 'input',
    name: 'path',
    validate: validatePluginPath,
    message: 'Where do you want to create your plugin?',
    filter: pathHelper.resolve
};
