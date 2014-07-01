var fs = require('fs'),
    path = require('path');

module.exports = {
    type:'checkbox',
    name:'plugins',
    choices:JSON.parse(fs.readFileSync(path.join(__dirname, '../../../lib/plugins.json'))),
    message:'Which plugins do you want to install right now?'
};
