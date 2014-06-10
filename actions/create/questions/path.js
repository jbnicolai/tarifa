var path = require('path'),
    fs = require('fs');

module.exports = {
    type:'input',
    name:'path',
    validate : function (answer) { return !fs.existsSync(path.resolve(answer)) || "folder already exist!";  },
    message:'Where do you want to create your project?'
};
