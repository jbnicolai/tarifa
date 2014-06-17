var path = require('path'),
    fs = require('fs');

function isPathValid(str) {
    var resolvedPath = path.resolve(str);
    return !fs.existsSync(resolvedPath) || fs.readdirSync(resolvedPath).length == 0;
}

module.exports = {
    type:'input',
    name:'path',
    validate : function (answer) {
        var msg = "folder already exist!";
        return isPathValid(answer) || mgs;
    },
    message:'Where do you want to create your project?'
};
