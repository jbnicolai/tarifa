var should = require('should'),
    Q = require('q'),
    os = require('os'),
    fs = require('fs'),
    format = require('util').format,
    path = require('path'),
    tmp = require('tmp'),
    setupHelper = require('./helper/setup');

module.exports = function (options) {
    describe(format('testing tarifa cli on %s', os.platform()), function() {

        var projectDefer = Q.defer(),
            anotherProjectDefer = Q.defer();

        before('create project', setupHelper(tmp, projectDefer, format('create_response_%s.json', os.platform())));

        it('create project', function () {
            this.timeout(0);
            return projectDefer.promise;
        });

        require('./actions/config')(projectDefer, options);
        require('./actions/plugins')(projectDefer, options);
        require('./actions/info')(projectDefer, options);
        require('./actions/prepare')(projectDefer, options);
        require('./actions/build')(projectDefer, options);
        require('./actions/clean')(projectDefer, options);
        require('./actions/check')(projectDefer, options);
        require('./actions/platform')(projectDefer, options);

        if(options.run) require('./actions/run')(projectDefer, options);

        before('create another project', setupHelper(tmp, anotherProjectDefer, 'create_response_android_sign.json'));
        require('./actions/sign_android')(anotherProjectDefer, options);
    });

    describe('testing tarifa android release build', function() {

        var projectDefer = Q.defer();

        before('create another project', setupHelper(tmp, projectDefer, 'create_response_android_sign.json'));

        it('create project', function () {
            this.timeout(0);
            return projectDefer.promise;
        });

        require('./actions/sign_android')(projectDefer, options);
    });
};
