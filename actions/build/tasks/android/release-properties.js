var Q = require('q'),
    print = require('../../../../lib/helper/print'),
    ask = require('../../../../lib/questions/ask'),
    releaseProperties = require('../../../../lib/android/release-properties');

module.exports = function (msg) {
    var root = process.cwd(),
        localConf = msg.localSettings.configurations.android[msg.configuration],
        label = localConf.sign;

    if (label) {
        var signing = msg.localSettings.signing.android[label],
            ks_path = signing.keystore_path,
            storepass = msg.keystore_pass,
            ks_alias = signing.keystore_alias,
            aliaspass = msg.keystore_alias_pass;

        return (storepass ? Q(storepass) : ask.password('What is the keystore password?')).then(function (s) {
            return (aliaspass ? Q(aliaspass) : ask.password('What is the alias password?')).then(function (a) {
                return releaseProperties.create(root, ks_path, ks_alias, s, a);
            });
        }).then(function () {
            if (msg.verbose) print.success('release.properties created');
            return msg;
        });
    }
    return msg;
};
