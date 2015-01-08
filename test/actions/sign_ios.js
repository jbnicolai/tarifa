var should = require('should'),
    Q = require('q'),
    tmp = require('tmp'),
    setupHelper = require('../helper/setup'),
    buildAction = require('../../actions/build'),
    tarifaFile = require('../../lib/tarifa-file'),
    pathHelper = require('../../lib/helper/path'),
    platformAction = require('../../actions/platform');

function build(root, id, identity, profile_path) {
    return tarifaFile.parse(root, 'ios', 'stage').then(function (localSettings) {
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
}

function testSign(projectDefer, identity, profile_path, id) {

    describe('sign ios app for ad-hoc distribution: ', function() {

        it('build ios stage and resolve', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return build(rslt.response.path, id, identity, profile_path);
            });
        });

        it('build ios stage and resolve after removing and reinstalling the ios platform', function () {
            this.timeout(0);
            return projectDefer.promise.then(function (rslt) {
                return platformAction.platform('remove', 'ios', false).then(function () {
                    return platformAction.platform('add', 'ios', false);
                }).then(function () {
                    return build(rslt.response.path, id, identity, profile_path);
                });
            });
        });

    });
}

var projectDefer = Q.defer();
before('create tarifa project', setupHelper.createProject(tmp, projectDefer, 'create_project_response_darwin.json'));
testSign(projectDefer, process.argv[3].split('=')[1], process.argv[4].split('=')[1], process.argv[5].split('=')[1]);
