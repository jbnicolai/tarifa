module.exports = {
    type:'list',
    name:'www',
    choices:['default', 'custom'],
    validate : function (answer) { return !fs.existsSync(path.resolve(answer)) || "folder already exist!";  },
    message:'What kind of build tool will you will use?'
};
