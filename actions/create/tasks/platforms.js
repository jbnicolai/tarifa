/*
 * add cordova platforms task
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

    process.chdir(cordova_path);

    cordova.platform('add', response.platforms, function (err) {
        process.chdir(cwd);
        if(err) {
            defer.reject(err);
            return;
        }
        if (response.options.verbose) {
            response.platforms.forEach(function (target) {
                console.log(chalk.green('✔') + ' cordova platform ' + target + ' added');
            });
        }
        defer.resolve(response);
    });

    return defer.promise;
};
