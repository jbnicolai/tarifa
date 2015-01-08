var should = require('should'),
    Q = require('q'),
    os = require('os'),
    format = require('util').format,
    tmp = require('tmp'),
    setupHelper = require('../helper/setup'),
    isAvailableOnHostSync = require('../../lib/cordova/platforms').isAvailableOnHostSync,
    settings = require('../../lib/settings'),
    platformAction = require('../../actions/platform');

function testPlatform(projectDefer) {

    describe('tarifa platform', function() {

        var availablePlatforms = settings.platforms.filter(isAvailableOnHostSync);

        it('remove all platforms', function () {
            this.timeout(0);
            return projectDefer.promise.then(function () {
                return platformAction.list().then(function (rslt) {
                    return rslt.reduce(function (promise, p) {
                        return promise.then(function () {
                            return platformAction.platform('remove', p, false);
                        });
                    }, Q.resolve());
                });
            });
        });

        availablePlatforms.forEach(function (platform) {
            it(format('tarifa platform add %s', platform), function () {
                this.timeout(0);
                return projectDefer.promise.then(function (rslt) {
                    return platformAction.platform('add', platform, false);
                });
            });
        });

        it('tarifa platform list', function () {
            this.timeout(0);
            return projectDefer.promise.then(function () {
                return platformAction.list().then(function (rslt) {
                    availablePlatforms.forEach(function (p) {
                        rslt.indexOf(p).should.be.above(-1)
                    });
                });
            });
        });

        availablePlatforms.forEach(function (platform) {
            it(format('try to re call tarifa platform add %s', platform), function () {
                this.timeout(0);
                return projectDefer.promise.then(function (rslt) {
                    return platformAction.platform('add', platform, false).should.be.rejected;
                });
            });
        });
    });
}

if(module.parent.id.indexOf("mocha.js") > 0) {
    var projectDefer = Q.defer();
    before('create a empty project', setupHelper.createProject(tmp, projectDefer, format('create_project_response_%s.json', os.platform())));
    testPlatform(projectDefer);
}

module.exports = testPlatform;
