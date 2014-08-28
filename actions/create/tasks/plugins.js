/*
 * add cordova plugins task
 */

var Q = require('q'),
    path = require('path'),
    plugins = require('../../../lib/cordova/plugins'),
    print = require('../../../lib/helper/print'),
    settings = require('../../../lib/settings');

module.exports = function (response) {
    var platforms = response.platforms.filter(function (platform) { return platform != 'web'; });
    if (platforms.length === 0 || response.plugins.length === 0) return Q.resolve(response);

    return response.plugins.reduce(function (promise, plugin) {
        return promise.then(function () {
            return plugins.add(response.path, plugin).then(function () {
                if (response.options.verbose)
                    print.success('cordova plugin %s added', plugin);
                return Q.resolve(response);
            });
        });
    }, Q.resolve()).fail(function (reason) {
        var advice = 'You may have a problem with your network connectivity. ' +
                     'Try to add your plugins with tarifa plugin add when your network settings are fixed.';
        print.warning('tarifa plugin add error in %s, reason:\n%s\n%s', response.path, reason, advice);
        return Q.resolve(response);
    });
};
