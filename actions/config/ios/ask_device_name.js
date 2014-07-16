var Q = require('q'),
    inquirer = require('inquirer'),

    question = [{
        type:'input',
        name:'device_name',
        message:'Choose your device label'
    }];

module.exports = function () {
    var defer = Q.defer();

    inquirer.prompt(question, function(response) {
        defer.resolve(response.device_name);
    });

    return defer.promise;
};
