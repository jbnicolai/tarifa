var should = require('should'),
    Q = require('q'),
    os = require('os'),
    format = require('util').format,
    tmp = require('tmp'),
    setupHelper = require('../helper/setup'),
    checkAction = require('../../actions/check');

function testCheck(projectDefer) {
    describe('tarifa check', function() {
        it('should not fail', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return checkAction.check(false);
            });
        });
    });
}

if(module.parent.id.indexOf("mocha.js") > 0) {
    var projectDefer = Q.defer();
    before('create a empty project', setupHelper.createProject(tmp, projectDefer, format('create_project_response_%s.json', os.platform())));
    testCheck(projectDefer);
}

module.exports = testCheck;
