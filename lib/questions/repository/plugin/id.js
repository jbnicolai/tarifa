var validator = require('../../../../lib/helper/validator'),
    validatePluginId = validator.toInquirerValidateƒ(validator.isProjectId);

module.exports = {
    type: 'input',
    name: 'id',
    validate: validatePluginId,
    message: 'Choose a reverse-domain identifier for your plugin'
};
