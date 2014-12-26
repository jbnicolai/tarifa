var should = require('should'),
    Q = require('q'),
    tmp = require('tmp'),
    setupHelper = require('../helper/setup'),
    buildAction = require('../../actions/build'),
    tarifaFile = require('../../lib/tarifa-file'),
    pathHelper = require('../../lib/helper/path');

function testSign(projectDefer, identity, profile_path, id) {

    describe('sign ios app for ad-hoc distribution', function() {
        it('build ios stage should resolve', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return tarifaFile.parse(rslt.response.path, 'ios', 'stage').then(function (localSettings) {
                    localSettings.configurations.ios.stage.id = id;
                    localSettings.configurations.ios.stage.apple_developer_identity = identity;
                    localSettings.configurations.ios.stage.provisioning_profile_path = profile_path;
                    return buildAction.buildƒ({
                        platform: 'ios',
                        configuration: 'stage',
                        localSettings: localSettings,
                        keepFileChanges: false,
                        verbose: false
                    });
                });
            });
        });
    });
}

var projectDefer = Q.defer();
before('create tarifa project', setupHelper(tmp, projectDefer, 'create_response_darwin.json'));
testSign(projectDefer, process.argv[3].split('=')[1], process.argv[4].split('=')[1], process.argv[5].split('=')[1]);
