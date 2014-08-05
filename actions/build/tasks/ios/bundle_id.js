var Q = require('q'),
    path = require('path'),
    fs = require('fs'),
    plist = require('plist'),
    print = require('../../../../lib/helper/print'),
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
            print.success('bundleId set to %s', id);
    return Q.resolve(msg);
};
