/*
 * create empty cordova  app task
 */

var path = require('path'),
    cordova = require('cordova'),
    Q = require('q'),
    print = require('../../../lib/helper/print'),
    settings = require('../../../lib/settings'),
    // setting an empty folder as the default www template
    cfg = {
        lib : {
            www : {
                id : "tarifa",
                version : "0.0.0",
                uri : path.join(__dirname, '../../../template/empty')
            }
        }
    };

module.exports = function (response) {
    var cordova_path = path.resolve(path.join(response.path, settings.cordovaAppPath)),
        cwd = process.cwd(),
        defer = Q.defer();

    cordova.create(cordova_path, response.id, response.name, cfg, function (err) {
        if(err) {
            defer.reject(err);
            return;
        }
        if (response.options.verbose) print.success('cordova raw app created here %s', cordova_path);
        defer.resolve(response);
    });

    return defer.promise;
};
