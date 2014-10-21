var should = require('should'),
    Q = require('q'),
    fs = require('fs'),
    path = require('path'),
    tmp = require('tmp'),
    setupHelper = require('../helper/setup'),
    cleanHelper = require('../helper/clean'),
    prepareAction = require('../../actions/prepare'),
    buildAction = require('../../actions/build'),
    cleanAction = require('../../actions/clean'),
    pluginAction = require('../../actions/plugin'),
    checkAction = require('../../actions/check'),
    configAction = require('../../actions/config'),
    runAction = require('../../actions/run'),
    platformAction = require('../../actions/platform');

describe('testing tarifa cli on darwin', function() {

    var projectDefer = Q.defer(),
        cwd = process.cwd();

    before('create a empty project', setupHelper(tmp, projectDefer, 'create_response_win32.json'));

    it('create a project (wp8 & android)', function () {
        this.timeout(0);
        return projectDefer.promise;
    });

    describe('tarifa prepare', function() {
        it('tarifa prepare web', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return prepareAction.prepare('web', 'default', false);
            });
        });

        it('tarifa prepare android stage', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return prepareAction.prepare('android', 'stage', false);
            });
        });

        it('tarifa prepare wp8 prod', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return prepareAction.prepare('wp8', 'prod', false);
            });
        });
    });

    describe('tarifa build', function() {
        it('tarifa build web', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return buildAction.build('web', 'default', false, false);
            });
        });

        it('tarifa build android', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return buildAction.build('android', 'default', false, false);
            });
        });

        it('tarifa build wp8', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return buildAction.build('wp8', 'default', false, false);
            });
        });
    });

    describe('tarifa clean', function() {
        it('clean android', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return cleanAction.clean('android', false);
            });
        });
        it('clean wp8', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return cleanAction.clean('wp8', false);
            });
        });
    });

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

    });

    describe('tarifa check', function () {
        it('check android & wp8', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return checkAction.check(false);
            });
        });
    });

    describe('tarifa config', function () {
        it('tarifa config icons generate red dev', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return configAction.generateIcons('red', 'dev', false);
            });
        });

        it('tarifa config splashscreens red dev', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return configAction.generateSplashscreens('red', 'dev', false);
            });
        });

        it('tarifa config icons file test.png stage', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return configAction.generateIconsFromFile(path.resolve(__dirname, '..', 'fixtures', 'momo.png'), 'stage', false);
            });
        });

    });

    describe('tarifa run', function () {
        it('tarifa run android dev', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return runAction.run('android', 'dev', false);
            });
        });

        it('tarifa run android stage', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return runAction.run('android', 'stage', false);
            });
        });

        it('tarifa run wp8 stage', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return runAction.run('wp8', 'stage', false);
            });
        });

        it('tarifa run wp8', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return runAction.run('wp8', 'default', false);
            });
        });
    });

    describe('tarifa platform', function () {
        it('tarifa platform list', function () {
            this.timeout(0);
            return projectDefer.promise.then(function () {
                return platformAction.list().then(function (rslt) {
                    rslt.indexOf('android').should.be.above(-1);
                    rslt.indexOf('wp8').should.be.above(-1);
                });
            });
        });

        it('tarifa platform remove wp8', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return platformAction.platform('remove', 'wp8', false);
            });
        });

        it('tarifa platform remove android', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return platformAction.platform('remove', 'android', false);
            });
        });

        it('tarifa platform add android', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return platformAction.platform('add', 'android', false);
            });
        });

        it('try to re call tarifa platform add android', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return platformAction.platform('add', 'android', false).should.be.rejected;
            });
        });

    });

    after('clean temp folder', cleanHelper(projectDefer, tmp, cwd));
});
