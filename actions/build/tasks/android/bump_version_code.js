var Q = require('q'),
    libxmljs = require('libxmljs'),
    chalk = require('chalk'),
    path = require('path'),
    fs = require('fs'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var version_code = msg.settings.configurations.android[msg.config]['version_code'];
    if(version_code) {
        var android_manifest_path = path.join(process.cwd(), settings.cordovaAppPath, 'platforms', 'android', 'AndroidManifest.xml');

        var doc = libxmljs.parseXml(fs.readFileSync(android_manifest_path));
        fs.writeFileSync(android_manifest_path, doc.root().attr('android:versionCode', version_code));
        if(msg.verbose)
            console.log(chalk.green('✔') + ' change android versionCode to ' + version_code);
    }

    return Q.resolve(msg);
};
