/*
 * add cordova plugins task
 */

var Q = require('q'),
    path = require('path'),
    plugins = require('../../../lib/cordova/plugins'),
    print = require('../../../lib/helper/print'),
    settings = require('../../../lib/settings');

module.exports = function (response) {
    if(response.plugins.length === 0 ) return Q.resolve(response);

    return response.plugins.reduce(function (promise, plugin) {
        return promise.then(function () {
            return plugins.add(response.path, plugin).then(function () {
                if (response.options.verbose)
                    print.success('cordova plugin %s added', plugin);
                return Q.resolve(response);
            });
        });
    }, Q.resolve());
};
