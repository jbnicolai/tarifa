var path = require('path'),
    fs = require('fs');

module.exports = {
    type:'input',
    name:'project_path',
    validate : function (answer) { return fs.existsSync(path.resolve(answer)) || "no folder found!";  },
    message:'Give the path of your www project'
};
