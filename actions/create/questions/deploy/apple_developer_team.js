var validator = require('../../../../lib/helper/validator'),
    validateAppleDeveloperTeam = validator.toInquirerValidateƒ(validator.isAppleDeveloperTeam);

module.exports = {
    dependency: 'ios',
    type:'input',
    name:'apple_developer_team',
    validate: validateAppleDeveloperTeam,
    message:'What is your developer apple team id?'
};
