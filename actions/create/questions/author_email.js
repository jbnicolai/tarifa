var validator = require('../../../lib/helper/validator'),
    validateEmail = validator.toInquirerValidateƒ(validator.isEmail);

module.exports = {
    type:'input',
    name:'author_email',
    message:'What\'s your email?',
    validate: validateEmail
};
