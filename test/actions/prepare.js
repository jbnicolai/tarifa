var should = require('should'),
    Q = require('q'),
    os = require('os'),
    format = require('util').format,
    tmp = require('tmp'),
    setupHelper = require('../helper/setup'),
    isAvailableOnHostSync = require('../../lib/cordova/platforms').isAvailableOnHostSync,
    settings = require('../../lib/settings'),
    prepareAction = require('../../actions/prepare');

function testPrepare(projectDefer) {

    describe('tarifa prepare', function() {

        settings.platforms.forEach(function (p) {

            if(isAvailableOnHostSync(p)) {
                it(format('tarifa prepare %s', p), function () {
                    this.timeout(0);
                    return projectDefer.promise.then(function (rslt) {
                        return prepareAction.prepare(p, 'default', false);
                    });
                });

                it(format('tarifa prepare %s stage', p), function () {
                    this.timeout(0);
                    return projectDefer.promise.then(function (rslt) {
                        return prepareAction.prepare(p, 'stage', false);
                    });
                });

                it(format('tarifa prepare %s prod', p), function () {
                    this.timeout(0);
                    return projectDefer.promise.then(function (rslt) {
                        return prepareAction.prepare(p, 'prod', false);
                    });
                });
            }

        });
    });
}

if(module.parent.id.indexOf("mocha.js") > 0) {
    var projectDefer = Q.defer();
    before('create a empty project', setupHelper(tmp, projectDefer, format('create_response_%s.json', os.platform())));
    testPrepare(projectDefer);
}

module.exports = testPrepare;
