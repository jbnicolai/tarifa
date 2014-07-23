var Q = require('q'),
    inquirer = require('inquirer'),
    devices = require('../../lib/devices');

module.exports = function (platform) {
    var defer = Q.defer();

    devices[platform]().then(function (items) {
        console.log(items);
        var question = {
            type:'list',
            name:'device',
            choices:items,
            message:'Which device do you want to use?'
        };
        inquirer.prompt([question], function (response) {
            defer.resolve(response.device);
        });
    });

    return defer.promise;
};
