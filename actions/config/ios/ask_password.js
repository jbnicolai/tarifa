var Q = require('q'),
    inquirer = require('inquirer'),

    question = [{
        type:'password',
        name:'password',
        message:'What is your apple developer password?'
    }];

module.exports = function () {
    var defer = Q.defer();

    inquirer.prompt(question, function(response) {
        defer.resolve(response.password);
    });

    return defer.promise;
};
