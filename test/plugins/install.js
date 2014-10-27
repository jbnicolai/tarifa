var should = require('should'),
    format = require('util').format,
    plugins = require('../../lib/plugins'),
    pluginAction = require('../../actions/plugin');

module.exports = function (projectDefer, options) {
    describe('be able to add and remove any default plugins', function () {

        plugins.filter(function (p) { return !p["default"]; }).forEach(function (plugin) {
            it(format('tarifa plugin add %s', plugin.uri), function () {
                this.timeout(0);
                return projectDefer.promise.then(function (rslt) {
                    return pluginAction.plugin('add', plugin.uri, false).then(function () {
                        return pluginAction.list(false).then(function (rslt) {
                            rslt.indexOf(plugin.value).should.be.above(-1);
                        });
                    });
                });
            });
        });

        plugins.forEach(function (plugin) {
            it(format('tarifa plugin remove %s', plugin.value), function () {
                this.timeout(0);
                return projectDefer.promise.then(function (rslt) {
                    return pluginAction.plugin('remove', plugin.value, false).then(function () {
                        return pluginAction.list(false).then(function (rslt) {
                            rslt.indexOf(plugin.value).should.be.below(0);
                        });
                    });
                });
            });
        });
    });
};
