module.exports = {
    dependency: 'ios',
    condition: function (answer) {
        return answer.deploy;
    },
    type:'input',
    name:'label',
    message:'Name a label for this siging profile'
};
