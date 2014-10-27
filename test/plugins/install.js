var should = require('should'),
    format = require('util').format,
    plugins = require('../../lib/plugins'),
    pluginAction = require('../../actions/plugin');

module.exports = function (projectDefer, options) {

    describe('tarifa plugin', function() {
        it('tarifa plugin add ../../fixtures/emptyplugin', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return pluginAction.plugin('add', path.join(__dirname, '../fixtures/emptyplugin'), false);
            });
        });

        it('tarifa plugin list', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return pluginAction.list(false).then(function (rslt) {
                    rslt.indexOf("test.test.test").should.equal(1);
                });
            });
        });

        it('re tarifa plugin add ../fixtures/emptyplugin', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                var p = path.join(__dirname, '../fixtures/emptyplugin');
                return pluginAction.plugin('add', p, false).should.be.rejected;
            });
        });

        it('tarifa plugin remove test.test.test', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return pluginAction.plugin('remove', 'test.test.test');
            });
        });

        it('tarifa plugin add https://github.com/apache/cordova-plugin-vibration.git#r0.3.11', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return pluginAction.plugin('add', 'https://github.com/apache/cordova-plugin-vibration.git#r0.3.11', false).then(function () {
                    return pluginAction.list(false).then(function (rslt) {
                        rslt.indexOf("org.apache.cordova.vibration").should.equal(1);
                    });
                });
            });
        });

        it('tarifa plugin remove org.apache.cordova.vibration', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return pluginAction.plugin('remove', 'org.apache.cordova.vibration');
            });
        });
    });

    describe('be able to add and remove any default plugins', function () {

        plugins.filter(function (p) { return !p["default"] && p.value !== 'org.apache.cordova.file'; }).forEach(function (plugin) {
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

        plugins.filter(function (p) { return p.value !== 'org.apache.cordova.file'; }).forEach(function (plugin) {
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
