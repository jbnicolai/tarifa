var Q = require('q'),
    path = require('path'),
    fs = require('fs'),
    pathHelper = require('../../../../lib/helper/path'),
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var identity = msg.localSettings.configurations.ios[msg.configuration]['apple_developer_identity'];
    var newIdentity = 'CODE_SIGN_IDENTITY = ' + identity;
    if(identity) {
        var xcconfigPath = path.join(pathHelper.app(), 'platforms', 'ios', 'cordova', 'build.xcconfig');
        fs.writeFileSync(xcconfigPath, fs.readFileSync(xcconfigPath, 'utf-8').replace(/CODE_SIGN_IDENTITY =.*$/, newIdentity));
        if(msg.verbose)
            print.success('change apple developer identity to %s', identity);
    }
    return Q.resolve(msg);
};
