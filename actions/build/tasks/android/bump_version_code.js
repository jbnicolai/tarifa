var Q = require('q'),
    path = require('path'),
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings'),
    builder = require('../../../../lib/xml/android/AndroidManifest.xml');

module.exports = function (msg) {
    var version_code = msg.localSettings.configurations.android[msg.configuration]['version_code'];
    var androidManifestXmlPath = path.join(process.cwd(), settings.cordovaAppPath, 'platforms/android/AndroidManifest.xml');
    if(!version_code) return Q.resolve(msg);

    return builder.setVersionCode(androidManifestXmlPath, version_code).then(function () {
        if(msg.verbose)
            print.success('change android versionCode to %s', version_code);
        return msg;
    });
};
