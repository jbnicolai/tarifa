var Q = require('q'),
    chalk = require('chalk'),
    path = require('path'),
    fs = require('fs'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var identity = settings.default_apple_developer_identity;
    var newIdentity = 'CODE_SIGN_IDENTITY = ' + identity;
    var xcconfigPath = path.join(process.cwd(), settings.cordovaAppPath, 'platforms', 'ios', 'cordova', 'build.xcconfig');
    fs.writeFileSync(xcconfigPath, fs.readFileSync(xcconfigPath, 'utf-8').replace(/CODE_SIGN_IDENTITY = .*$/, newIdentity));
    if(msg.verbose)
        console.log(chalk.green('✔') + ' change back apple developer identity to default identity: ' + identity);
    return Q.resolve(msg);
};
