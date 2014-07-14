var path = require('path'),
    fs = require('fs');

module.exports = {
    dependency: 'ios',
    type:'input',
    name:'provisioning_profile',
    validate : function (answer) {
        // TODO  we need to check if it is a real provisioning file?
        return fs.existsSync(path.resolve(answer)) || 'file not found!';
    },
    message:'Which provisioning profile do you want to use for hadhoc distribution?'
};
