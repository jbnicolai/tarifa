module.exports = {
    dependency: 'android',
    condition: function (answer) {
        return answer.deploy;
    },
    type: 'confirm',
    name: 'keystore_reuse',
    message: 'Do you want to use an existing keystore?'
};
