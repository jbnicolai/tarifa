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
    platformAction = require('../../actions/platform'),
    settings = require('../../lib/settings');

module.exports = function (options) {
    describe('testing tarifa cli on darwin', function() {

        var projectDefer = Q.defer(),
            cwd = process.cwd();

        before('create a empty project', setupHelper(tmp, projectDefer, 'create_response_darwin.json'));

        it('create a project (android & ios)', function () {
            this.timeout(0);
            return projectDefer.promise;
        });

        require('../plugins/install')(projectDefer, options);

        describe('tarifa prepare', function() {
            it('tarifa prepare default browser', function () {
                this.timeout(0);
                return projectDefer.promise.then(function (rslt) {
                    return prepareAction.prepare('browser', 'default', false);
                });
            });

            it('tarifa prepare stage android', function () {
                this.timeout(0);
                return projectDefer.promise.then(function (rslt) {
                    return prepareAction.prepare('android', 'stage', false);
                });
            });

            it('tarifa prepare prod ios', function () {
                this.timeout(0);
                return projectDefer.promise.then(function (rslt) {
                    return prepareAction.prepare('ios', 'prod', false);
                });
            });
        });

        describe('tarifa build', function() {
            it('tarifa build dev', function() {
                this.timeout(0);
                return projectDefer.promise.then(function (rslt) {
                    return buildAction.buildAll('dev', false, false);
                });
            });

            it('tarifa build default browser', function () {
                this.timeout(0);
                return projectDefer.promise.then(function (rslt) {
                    return buildAction.build('browser', 'default', false, false);
                });
            });

            it('tarifa build default android', function () {
                this.timeout(0);
                return projectDefer.promise.then(function (rslt) {
                    return buildAction.build('android', 'default', false, false);
                });
            });

            it('tarifa build default ios', function () {
                this.timeout(0);
                return projectDefer.promise.then(function (rslt) {
                    return buildAction.build('ios', 'default', false, false);
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
            it('clean ios', function () {
                this.timeout(0);
                return projectDefer.promise.then(function (rslt) {
                    return cleanAction.clean('ios', false);
                });
            });
        });

        describe('tarifa check', function () {
            it('check android & ios', function () {
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
                it('tarifa run dev', function() {
                    this.timeout(0);
                    return projectDefer.promise.then(function (rslt) {
                        return runAction.runAll('dev', false);
                    });
                });

                it('tarifa run dev android', function () {
                    this.timeout(0);
                    return projectDefer.promise.then(function (rslt) {
                        return runAction.run('android', 'dev', false);
                    });
                });

                it('tarifa run stage android', function () {
                    this.timeout(0);
                    return projectDefer.promise.then(function (rslt) {
                        return runAction.run('android', 'stage', false);
                    });
                });

                it('tarifa run stage ios', function () {
                    this.timeout(0);
                    return projectDefer.promise.then(function (rslt) {
                        return runAction.run('ios', 'stage', false);
                    });
                });

                it('tarifa run dev ios', function () {
                    this.timeout(0);
                    return projectDefer.promise.then(function (rslt) {
                        return runAction.run('ios', 'dev', false);
                    });
                });

                it('tarifa run stage browser', function () {
                    this.timeout(0);
                    return projectDefer.promise.then(function (rslt) {
                        return runAction.run('browser', 'stage', false);
                    });
                });

                it('tarifa run default browser', function () {
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
                        rslt.indexOf('ios').should.be.above(-1);
                        rslt.indexOf('android').should.be.above(-1);
                    });
                });
            });

            it('tarifa platform remove ios', function () {
                this.timeout(0);
                return projectDefer.promise.then(function (rslt) {
                    return platformAction.platform('remove', 'ios', false);
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

        describe('run tarifa from various directories', function () {
            it('tarifa build from project subdir', function () {
                this.timeout(0);
                return projectDefer.promise.then(function (rslt) {
                    process.chdir(path.join(process.cwd(), settings.images));
                }).then(function (rslt) {
                    return buildAction.build('browser', 'default', false, false);
                });
            });

            it('tarifa build from root dir', function () {
                this.timeout(0);
                return projectDefer.promise.then(function (rslt) {
                    process.chdir('/');
                }).then(function (rslt) {
                    return buildAction.build('browser', 'default', false, false).should.be.rejected;
                });
            });
        });

    });
};
