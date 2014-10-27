var Q = require('q'),
    fs = require('q-io/fs'),
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings'),
    askPassword = require('./ask_password'),
    releaseProperties = require('../../../../lib/android/release-properties');

module.exports = function (msg) {
    var root = process.cwd(),
        localConf = msg.localSettings.configurations.android[msg.configuration],
        keystore_path = localConf['keystore_path'],
        keystore_alias = localConf['keystore_alias'];

    if(keystore_path && keystore_alias) {
        return askPassword().then(function (password) {
            return releaseProperties.create(root, keystore_path, keystore_alias, password)
                .then(function () {
                    if(msg.verbose) print.success('release.properties created');
                    return msg;
                });
        });
    }
    return msg;
};
