// FIXME, we need to fetch the list of provisioning profile
// and ask the user for one, we can download it after...

var path = require('path'),
    fs = require('fs');

module.exports = {
    dependency: 'ios',
    type:'input',
    name:'provisioning_profile_path',
    validate : function (answer) {
        return !fs.existsSync(path.resolve(answer)) || 'file already exists!';
    },
    message:'Where will be the location of the mobile provisioning file?'
};
