var Q = require('q'),
    chalk = require('chalk'),
    path = require('path'),
    fs = require('fs'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var identity = msg.settings.configurations.ios[msg.config]['apple_developer_identity'];
    var newIdentity = 'CODE_SIGN_IDENTITY = ' + identity;
    if(identity) {
        var xcconfigPath = path.join(process.cwd(), settings.cordovaAppPath, 'platforms', 'ios', 'cordova', 'build.xcconfig');
        fs.writeFileSync(xcconfigPath, fs.readFileSync(xcconfigPath, 'utf-8').replace(/CODE_SIGN_IDENTITY =.*$/, newIdentity));
        if(msg.verbose)
            console.log(chalk.green('✔') + ' change apple developer identity to ' + identity);
    }
    return Q.resolve(msg);
};
