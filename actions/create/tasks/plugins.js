/*
 * add cordova plugins task
 */

var Q = require('q'),
    path = require('path'),
    plugins = require('../../../lib/cordova/plugins'),
    print = require('../../../lib/helper/print'),
    tarifaFile = require('../../../lib/tarifa-file');

function add_cordova_plugin (root, id) {
    return plugins.add(root, id).then(function () {
        return tarifaFile.addPlugin(root, id);
    });
}

module.exports = function (response) {
    var platforms = response.platforms.filter(function (platform) { return platform != 'web'; });

    // adding org.apache.cordova.splashscreen as a default plugin..
    response.plugins.push('org.apache.cordova.splashscreen@0.3.3');

    return response.plugins.reduce(function (promise, plugin) {
        return promise.then(function () {
            return add_cordova_plugin(path.resolve(process.cwd(), response.path), plugin).then(function () {
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
