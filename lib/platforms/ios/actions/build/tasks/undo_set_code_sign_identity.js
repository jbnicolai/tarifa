var Q = require('q'),
    path = require('path'),
    fs = require('fs'),
    pathHelper = require('../../../../../helper/path'),
    print = require('../../../../../helper/print'),
    settings = require('../../../../../settings');

module.exports = function (msg) {
    var identity = settings.default_apple_developer_identity;
    var newIdentity = 'CODE_SIGN_IDENTITY = ' + identity;
    var xcconfigPath = path.join(pathHelper.app(), 'platforms', 'ios', 'cordova', 'build-release.xcconfig');
    fs.writeFileSync(xcconfigPath, fs.readFileSync(xcconfigPath, 'utf-8').replace(/CODE_SIGN_IDENTITY = .*$/, newIdentity));
    if(msg.verbose)
        print.success('change back apple developer identity to default identity: %s', identity);
    return Q.resolve(msg);
};
