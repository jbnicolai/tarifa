var Q = require('q'),
    path = require('path'),
    fs = require('q-io/fs'),
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings'),
    antProperties = require('../../../../lib/android/ant-properties');

module.exports = function (msg) {
    var root = process.cwd(),
        localConf = msg.localSettings.configurations.android[msg.configuration],
        keystore_path = localConf['keystore_path'],
        keystore_alias = localConf['keystore_alias'];

    if(keystore_path && keystore_alias) {
        return antProperties.create(root, keystore_path, keystore_alias)
            .then(function () {
                if(msg.verbose)
                    print.success('ant.properties created');
                return msg;
            });
    } else {
        return antProperties.remove(root).then(function () { return msg; });
    }
};
