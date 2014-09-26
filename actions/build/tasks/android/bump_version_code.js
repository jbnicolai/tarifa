var Q = require('q'),
    path = require('path'),
    print = require('../../../../lib/helper/print'),
    builder = require('../../../../lib/xml/android/AndroidManifest.xml');

module.exports = function (msg) {
    var version_code = msg.localSettings.configurations.android[msg.configuration]['version_code'];
    if(!version_code) return Q.resolve(msg);

    return builder.setVersionCode(version_code).then(function () {
        if(msg.verbose)
            print.success('change android versionCode to %s', version_code);
        return msg;
    });
};
