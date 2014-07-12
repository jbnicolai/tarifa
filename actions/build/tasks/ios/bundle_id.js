var Q = require('q'),
    chalk = require('chalk'),
    path = require('path'),
    fs = require('fs'),
    plist = require('plist'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var id = msg.settings.configurations.ios[msg.config]['id'] || msg.settings.configurations.ios['default']['id'];
    var name = msg.settings.name;
    var plistFileName = name + '-Info.plist';
    var plistPath = path.join(process.cwd(), settings.cordovaAppPath, 'platforms', 'ios', name, plistFileName);
    var plistObj = plist.parseFileSync(plistPath);

    plistObj.CFBundleIdentifier = id;
    fs.writeFileSync(plistPath, plist.build(plistObj).toString());
    if(msg.verbose)
            console.log(chalk.green('✔') + ' bundleId set to ' + id);
    return Q.resolve(msg);
};
