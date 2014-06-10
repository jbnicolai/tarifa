module.exports = {
    type:'input',
    name:'description',
    validate : function (answer) { return answer.length > 0; },
    message:'What\'s is your project about?'
};
