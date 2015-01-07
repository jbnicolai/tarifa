var validator = require('../../../lib/helper/validator'),
    validateKeywordsList = validator.toInquirerValidateƒ(validator.isKeywordsList);

module.exports = {
    type: 'input',
    name: 'keywords',
    message: 'Choose keywords that describe your plugin',
    validate: validateKeywordsList
};
