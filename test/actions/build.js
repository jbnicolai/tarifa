var should = require('should'),
    Q = require('q'),
    os = require('os'),
    format = require('util').format,
    tmp = require('tmp'),
    path = require('path'),
    setupHelper = require('../helper/setup'),
    isAvailableOnHostSync = require('../../lib/cordova/platforms').isAvailableOnHostSync,
    settings = require('../../lib/settings'),
    buildAction = require('../../actions/build');

function testBuild(projectDefer) {

    describe('tarifa build', function() {

        it(format("tarifa build all default,dev"), function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return buildAction.buildMorePlatforms(null, 'default,dev', false, false);
            });
        });
    });

    describe('run tarifa from various directories', function () {

        var cwd = process.cwd();

        it('tarifa build from project subdir', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                process.chdir(path.join(rslt.dirPath, 're', settings.images));
            }).then(function (rslt) {
                return buildAction.build('browser', 'default', false, false);
            });
        });

        it('tarifa build from parent dir', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                process.chdir('..');
            }).then(function (rslt) {
                return buildAction.build('browser', 'default', false, false).then(function (p) {
                    return p;
                }, function (err) {
                    process.chdir(cwd);
                    return Q.reject(err);
                }).should.be.rejected;
            });
        });
    });
}

if(module.parent.id.indexOf("mocha.js") > 0) {
    var projectDefer = Q.defer();
    before('create a empty project', setupHelper(tmp, projectDefer, format('create_response_%s.json', os.platform())));
    testBuild(projectDefer);
}

module.exports = testBuild;
