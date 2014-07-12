var Q = require('q'),
    chalk = require('chalk'),
    path = require('path'),
    fs = require('fs'),
    xcode = require('xcode'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var name = msg.settings.configurations.ios[msg.config]['name'];
    var xcodeProjFileName = msg.settings.name + '.xcodeproj/project.pbxproj';
    var pbxprojPath = path.join(process.cwd(), settings.cordovaAppPath, 'platforms', 'ios', xcodeProjFileName);
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
            console.log(chalk.green('✔') + ' product name set to ' + name);
        defer.resolve(msg);
    });

    return defer.promise;
};
