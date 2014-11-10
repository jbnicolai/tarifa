var should = require('should'),
    Q = require('q'),
    os = require('os'),
    format = require('util').format,
    tmp = require('tmp'),
    setupHelper = require('../helper/setup'),
    isAvailableOnHostSync = require('../../lib/cordova/platforms').isAvailableOnHostSync,
    settings = require('../../lib/settings'),
    runAction = require('../../actions/run');

function testRun(projectDefer) {

    describe('tarifa run', function() {

        settings.platforms.forEach(function (p) {

            if(isAvailableOnHostSync(p)) {

                it(format('tarifa run %s dev', p), function () {
                    this.timeout(0);
                    return projectDefer.promise.then(function (rslt) {
                        return runAction.run(p, 'dev', false);
                    });
                });

                it(format('tarifa run %s stage', p), function () {
                    this.timeout(0);
                    return projectDefer.promise.then(function (rslt) {
                        return runAction.run(p, 'stage', false);
                    });
                });

            }
        });
    });
}

if(module.parent.id.indexOf("mocha.js") > 0) {
    var projectDefer = Q.defer();
    before('create a empty project', setupHelper(tmp, projectDefer, format('create_response_%s.json', os.platform())));
    testRun(projectDefer);
}

module.exports = testRun;
