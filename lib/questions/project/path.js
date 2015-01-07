var validator = require('../../../lib/helper/validator'),
    validateProjectPath = validator.toInquirerValidateƒ(validator.isNonExistingOrEmptyFolderPath);

module.exports = {
    type:'input',
    name:'path',
    validate: validateProjectPath,
    message:'Where do you want to create your project?'
};
