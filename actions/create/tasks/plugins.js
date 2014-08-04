/*
 * add cordova plugins task
 */

var path = require('path'),
    chalk = require('chalk'),
    plugins = require('../../../lib/cordova/plugins'),
    settings = require('../../../lib/settings');

module.exports = function (response) {
    if(response.plugins.length === 0 ) return Q.resolve(response);

    return plugins.add(response.path, response.plugins).then(function () {
        if (response.options.verbose)
            console.log(chalk.green('✔') + ' cordova plugins added');
        return response;
    });
};
