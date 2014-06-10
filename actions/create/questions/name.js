module.exports = {
    type:'input',
    name:'name',
    validate : function (answer) { return answer.length > 0; },
    message:'What\'s the name of your project?'
};
