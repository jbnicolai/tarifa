module.exports = {
    dependency: 'ios',
    condition: function (answer) {
        return answer.deploy;
    },
    type: 'password',
    name: 'password',
    message: 'What is your apple developer password?'
};
