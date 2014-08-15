var validator = require('../../../lib/helper/validator'),
    validateId = validator.toInquirerValidateƒ(validator.isId);

module.exports = {
    type:'input',
    name:'id',
    validate: validateId,
    message:'Choose a default namespace/bundleid/packagename for your project'
};
