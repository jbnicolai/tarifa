var Q = require('q'),
    inquirer = require('inquirer'),
    devices = require('../../lib/devices');

module.exports = function (conf) {

    if (conf.platform === 'web') return Q(conf);

    var defer = Q.defer();
    devices[conf.platform]().then(function (items) {
        if (items.length === 0)
            return defer.reject("Error: no devices available!");

        if (items.length === 1) {
            conf.device = {
                value: items[0],
                index : 0
            };
            return defer.resolve(conf);
        }

        var question = {
            type:'list',
            name:'device',
            choices:items,
            message:'Which device do you want to use?'
        };
        inquirer.prompt([question], function (response) {
            conf.device = {
                value: response.device,
                index : items.indexOf(response.device)
            };
            defer.resolve(conf);
        });
    });

    return defer.promise;
};
