var print = require('../../../../lib/helper/print'),
    askPassword = require('./ask_password'),
    releaseProperties = require('../../../../lib/android/release-properties');

module.exports = function (msg) {
    var root = process.cwd(),
        localConf = msg.localSettings.configurations.android[msg.configuration],
        keystore_path = localConf['keystore_path'],
        keystore_alias = localConf['keystore_alias'];

    if (keystore_path && keystore_alias) {
        return askPassword('What is the storepass?').then(function (storepass) {
            return askPassword('What is the keypass?').then(function (keypass) {
                return releaseProperties.create(root, keystore_path, keystore_alias, storepass, keypass).then(function () {
                    if (msg.verbose) print.success('release.properties created');
                    return msg;
                });
            });
        });
    }
    return msg;
};
