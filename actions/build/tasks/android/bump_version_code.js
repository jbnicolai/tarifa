var Q = require('q'),
    path = require('path'),
    print = require('../../../../lib/helper/print'),
    pathHelper = require('../../../../lib/helper/path'),
    AndroidManifestBuilder = require('../../../../lib/xml/android/AndroidManifest.xml');
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var version_code = msg.localSettings.configurations.android[msg.configuration].version_code;
    if(version_code) {
        var androidManifestXmlPath = path.join(pathHelper.app(), 'platforms/android/AndroidManifest.xml');
        AndroidManifestBuilder.setVersionCode(androidManifestXmlPath, version_code);

        if(msg.verbose)
            print.success('change android versionCode to %s', version_code);
    }

    return Q.resolve(msg);
};
