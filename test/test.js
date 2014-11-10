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
            cwd = process.cwd();

        before('create a empty project', setupHelper(tmp, projectDefer, format('create_response_%s.json', os.platform())));

        it('create a project', function () {
            this.timeout(0);
            return projectDefer.promise;
        });

        require('./actions/plugins')(projectDefer, options);
        require('./actions/info')(projectDefer, options);
        require('./actions/prepare')(projectDefer, options);
        require('./actions/build')(projectDefer, options);
        require('./actions/clean')(projectDefer, options);
        require('./actions/check')(projectDefer, options);
        require('./actions/config')(projectDefer, options);
        require('./actions/platform')(projectDefer, options);
        if(options.run) require('./actions/run')(projectDefer, options);
    });
};
