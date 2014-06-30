/*
 * add cordova plugins task
 */

var path = require('path'),
    cordova = require('cordova'),
    Q = require('q'),
    chalk = require('chalk'),
    settings = require('../../../lib/settings');

module.exports = function (response) {
    var cordova_path = path.join(response.path, settings.cordovaAppPath),
        cwd = process.cwd(),
        defer = Q.defer();

    if(response.plugins.length === 0 ) return Q.resolve(response);

    process.chdir(cordova_path);

    cordova.plugin('add', response.plugins, function (err) {
        process.chdir(cwd);
        if(err) {
            defer.reject(err);
            return;
        }
        if (response.options.verbose) console.log(chalk.green('✔') + ' cordova plugins added');
        defer.resolve(response);
    });
    return defer.promise;
};
