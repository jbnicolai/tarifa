var should = require('should'),
    fs = require('fs'),
    Q = require('q'),
    path = require('path'),
    setupHelper = require('../helper/setup'),
    cleanHelper = require('../helper/clean'),
    prepareAction = require('../../actions/prepare'),
    tmp = require('tmp'),
    buildAction = require('../../actions/build');

describe('testing tarifa cli on darwin', function() {

    var projectDefer = Q.defer(),
        cwd = process.cwd(),
        mock = path.join(__dirname, '..', 'fixtures', 'create_response_darwin.json'),
        response = JSON.parse(fs.readFileSync(mock, 'utf-8'));

    before('create a empty project', setupHelper(tmp, projectDefer, response));

    it('create a project (android & ios)', function () {
        this.timeout(0);
        return projectDefer.promise.then(function (rslt) {
            rslt.rslt.should.equal(response);
        });
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

        it('tarifa prepare ios prod', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return prepareAction.prepare('ios', 'prod', false);
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

        it('tarifa build ios', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return buildAction.build('ios', 'default', false, false);
            });
        });
    });

    after('clean temp folder', cleanHelper(projectDefer, tmp, cwd));
});
