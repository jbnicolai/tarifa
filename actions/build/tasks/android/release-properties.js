var Q = require('q'),
    print = require('../../../../lib/helper/print'),
    askPassword = require('./ask_password'),
    releaseProperties = require('../../../../lib/android/release-properties');

module.exports = function (msg) {
    var root = process.cwd(),
        localConf = msg.localSettings.configurations.android[msg.configuration],
        ks_path = localConf['keystore_path'],
        storepass = msg.keystore_pass,
        ks_alias = localConf['keystore_alias'],
        aliaspass = msg.keystore_alias_pass;

    if (ks_path && ks_alias) {
        return (storepass ? Q(storepass) : askPassword('What is the keystore password?')).then(function (s) {
            return (aliaspass ? Q(aliaspass) : askPassword('What is the alias password?')).then(function (a) {
                return releaseProperties.create(root, ks_path, ks_alias, s, a);
            });
        }).then(function () {
            if (msg.verbose) print.success('release.properties created');
            return msg;
        });
    }
    return msg;
};
