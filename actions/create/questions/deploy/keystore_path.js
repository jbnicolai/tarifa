var path = require('path'),
    fs = require('fs');

module.exports = {
    dependency: 'android',
    type:'input',
    name:'keystore_path',
    validate : function (answer) {
        // TODO  we need to check if it's really a keystore and not just a file?
        return fs.existsSync(path.resolve(answer)) || 'file not found!';
    },
    message:'What is the keystore path?'
};
