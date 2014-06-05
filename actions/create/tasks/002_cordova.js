var path = require('path'),
    cordova = require('cordova'),
    Q = require('q'),
    chalk = require('chalk'),
    settings = require('../../../conf/settings.json'),
    cfg = {
        lib : {
            www : {
                id : "tarifa",
                version : "0.0.0",
                uri : path.join(__dirname, '../../../conf/empty-www')
            }
        }
    };

module.exports = function (response) {
    var cordova_path = path.join(response.project_path, settings.cordovaAppPath),
        cwd = process.cwd(),
        defer = Q.defer();

    cordova.create(cordova_path, response.project_id, response.project_name, cfg, function (err) {
        if(err) {
            defer.reject(err);
            return;
        }
        if (response.verbose) console.log('\n' + chalk.green('✔') + ' cordova raw app created here ' + path.resolve(cordova_path));
        process.chdir(cordova_path);
        cordova.platform('add', response.project_targets, function (err) {
            if(err) {
                process.chdir(cwd);
                defer.reject(err);
                return;
            }
            if (response.verbose) {
                response.project_targets.forEach(function (target) {
                    console.log(chalk.green('✔') + ' cordova platform ' + target + ' added');
                });
            }
            process.chdir(cwd);
            defer.resolve(response);
        });
    });

    return defer.promise;
};
