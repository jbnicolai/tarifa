var Q = require('q');

module.exports = function (message) {
    var d = Q.defer(),
        question = [{
            type: 'password',
            name: 'password',
            message: message
        }];
    require('inquirer').prompt(question, function (resp) {
        d.resolve(resp.password);
    });
    return d.promise;
};
