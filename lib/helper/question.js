var Q = require('q'),
    inquirer = require('inquirer');

module.exports.password = function (message) {
    var d = Q.defer(),
        question = [{
            type: 'password',
            name: 'password',
            message: message
        }];
    inquirer.prompt(question, function (resp) {
        d.resolve(resp.password);
    });
    return d.promise;
};
