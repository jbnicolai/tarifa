/*
 * add cordova platforms task
 */

var path = require('path'),
    cordova_platform_add = require('cordova/src/platform').add,
    cordova_util = require('cordova/src/util'),
    cordova_hooker = require('cordova/src/hooker'),
    Q = require('q'),
    chalk = require('chalk'),
    settings = require('../../../lib/settings');

module.exports = function (response) {
    var cordova_path = path.join(response.path, settings.cordovaAppPath),
        cwd = process.cwd();

    process.chdir(cordova_path);

    var projectRoot = cordova_util.cdProjectRoot(),
        hooks = new cordova_hooker(projectRoot),
        opts = {
            platforms:response.platforms,
            // android output too much stuff, ignore it for now!
            spawnoutput: {
                stdio: 'ignore'
            }
        };

    var platforms = response.platforms.filter(function (platform) { return platform != 'web'; });

    return cordova_platform_add(hooks, projectRoot, platforms, opts).then(function (err) {
        process.chdir(cwd);
        if(err) return Q.reject(err);
        if (response.options.verbose) {
            response.platforms.forEach(function (target) {
                console.log(chalk.green('✔') + ' cordova platform ' + target + ' added');
            });
        }
        return response;
    });
};
