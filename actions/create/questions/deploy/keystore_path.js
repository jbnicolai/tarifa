var path = require('path'),
    fs = require('fs');

module.exports = {
    type:'input',
    name:'keystore_path',
    validate : function (answer) {
        return fs.existsSync(path.resolve(answer)) || 'file not found!';
    },
    message:'What is the keystore path?'
};
