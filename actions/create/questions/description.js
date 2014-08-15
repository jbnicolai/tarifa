module.exports = {
    type:'input',
    name:'description',
    validate : function (answer) { return answer.length > 0; },
    message:'What\'s your project about?'
};
