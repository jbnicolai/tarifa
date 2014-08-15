var validator = require('../../../lib/helper/validator'),
    validateUrl = validator.toInquirerValidateƒ(validator.isUrl);

module.exports = {
    type:'input',
    name:'author_href',
    message:'What\'s your website?',
    validate: validateUrl
};
