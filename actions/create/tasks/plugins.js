/*
 * add cordova plugins task
 */

var Q = require('q'),
    path = require('path'),
    plugins = require('../../../lib/cordova/plugins'),
    pluginList = require('../../../lib/plugins.json'),
    print = require('../../../lib/helper/print'),
    tarifaFile = require('../../../lib/tarifa-file');

function add_cordova_plugin (root, name, uri) {
    return plugins.add(root, uri).then(function () {
        return tarifaFile.addPlugin(root, name, uri);
    });
}

module.exports = function (response) {

    var platforms = response.platforms.filter(function (platform) { return platform != 'web'; });

    // merge mandatory + user selected plugins
    response.plugins = pluginList.filter(function (p) { return p['default']; })
        .map(function (p) { return { uri: p.uri, value: p.value}; })
        .concat(response.plugins.map(function (plugin) {
            return pluginList.reduce(function (r, p) {
                if(p.value === plugin) { r.uri = p.uri; r.value = p.value; }
                return r;
            }, {});
        }));

    return response.plugins.reduce(function (promise, plugin) {
        return promise.then(function () {
            return add_cordova_plugin(path.resolve(process.cwd(), response.path), plugin.value, plugin.uri).then(function () {
                if (response.options.verbose)
                    print.success('cordova plugin %s added', plugin.value);
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
