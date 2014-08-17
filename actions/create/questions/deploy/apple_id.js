var validator = require('../../../../lib/helper/validator'),
    validateEmail = validator.toInquirerValidateƒ(validator.isEmail);

module.exports = {
    dependency: 'ios',
    type:'input',
    name:'apple_id',
    message:'What is your developer apple id?',
    validate: validateEmail
};
