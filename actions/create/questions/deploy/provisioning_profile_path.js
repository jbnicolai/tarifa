var validator = require('../../../../lib/helper/validator'),
    validateProvisioningProfilePath = validator.toInquirerValidateƒ(validator.isProvisioningProfilePath);

var path = require('path'),
    fs = require('fs');

module.exports = {
    dependency: 'ios',
    type:'input',
    name:'provisioning_profile_path',
    validate: validateProvisioningProfilePath,
    message:'Where will be the location of the mobile provisioning file?'
};
