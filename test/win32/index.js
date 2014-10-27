var should = require('should'),
    Q = require('q'),
    fs = require('fs'),
    path = require('path'),
    tmp = require('tmp'),
    setupHelper = require('../helper/setup'),
    prepareAction = require('../../actions/prepare'),
    buildAction = require('../../actions/build'),
    cleanAction = require('../../actions/clean'),
    checkAction = require('../../actions/check'),
    configAction = require('../../actions/config'),
    runAction = require('../../actions/run'),
    platformAction = require('../../actions/platform');

module.exports = function (options) {
    describe('testing tarifa cli on win32', function() {

        var projectDefer = Q.defer(),
            cwd = process.cwd();

        before('create a empty project', setupHelper(tmp, projectDefer, 'create_response_win32.json'));

        it('create a project (wp8 & android)', function () {
            this.timeout(0);
            return projectDefer.promise;
        });

        require('../plugins/install')(projectDefer, options);

        describe('tarifa prepare', function() {
            it('tarifa prepare browser', function () {
                this.timeout(0);
                return projectDefer.promise.then(function (rslt) {
                    return prepareAction.prepare('browser', 'default', false);
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
            it('tarifa build browser', function () {
                this.timeout(0);
                return projectDefer.promise.then(function (rslt) {
                    return buildAction.build('browser', 'default', false, false);
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

        if(options.run) {
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

                it('tarifa run browser stage', function () {
                    this.timeout(0);
                    return projectDefer.promise.then(function (rslt) {
                        return runAction.run('browser', 'stage', false);
                    });
                });

                it('tarifa run browser', function () {
                    this.timeout(0);
                    return projectDefer.promise.then(function (rslt) {
                        return runAction.run('browser', 'default', false);
                    });
                });

            });
        }

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

    });
};
