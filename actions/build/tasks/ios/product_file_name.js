var Q = require('q'),
    path = require('path'),
    fs = require('fs'),
    xcode = require('xcode'),
    pathHelper = require('../../../../lib/helper/path'),
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var ios = msg.localSettings.configurations.ios;
    var name = ios[msg.configuration]['product_name'] || ios['default']['product_name'];
    var xcodeProjFileName = msg.localSettings.name + '.xcodeproj/project.pbxproj';
    var pbxprojPath = path.join(pathHelper.app(), 'platforms', 'ios', xcodeProjFileName);
    var project = xcode.project(pbxprojPath);
    var defer = Q.defer();

    project.parse(function (err) {
        if (err) {
            defer.reject("pbxproj file parser error: " + err);
            return;
        }
        project.updateProductName(name);
        fs.writeFileSync(pbxprojPath, project.writeSync());

        if(msg.verbose)
            print.success('product name set to %s', name);
        defer.resolve(msg);
    });

    return defer.promise;
};
