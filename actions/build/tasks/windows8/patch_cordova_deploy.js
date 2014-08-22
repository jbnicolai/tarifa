var Q = require('q'),
    path = require('path'),
    format = require('util').format,
    fs = require('fs'),
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var id = msg.localSettings.configurations.windows8[msg.configuration]['id'];
    if(id) {
        var patch = format("var PACKAGE_NAME = '%s';", id),
            cwd = process.cwd(),
            deployScript = path.join(cwd, settings.cordovaAppPath, 'platforms', 'windows8', 'cordova', 'lib', 'deploy.js');
        fs.writeFileSync(deployScript, fs.readFileSync(deployScript, 'utf-8').replace(/var PACKAGE_NAME = '.*';/, patch));
        if(msg.verbose)
            print.success('patch deploy.js cordova script with package name %s', id);
    }
    return Q.resolve(msg);
};