var path = require('path'),
    fs = require('fs');

module.exports = {
    type:'input',
    name:'project_output',
    validate : function (answer) { return fs.existsSync(path.resolve(answer)) || "no folder found!";  },
    message:'Give the relative path of your www output to the root of your www project'
};
