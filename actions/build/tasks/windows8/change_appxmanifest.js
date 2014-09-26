var Q = require('q'),
    path = require('path'),
    print = require('../../../../lib/helper/print'),
    AppxmanifestBuilder = require('../../../../lib/xml/windows8/package.appxmanifest'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var cwd = process.cwd(),
        conf = msg.localSettings.configurations.windows8,
        manifestPath = path.join(cwd, settings.cordovaAppPath, 'platforms', 'windows8', 'package.appxmanifest'),
        name = conf[msg.configuration]['product_name'],
        package_id = conf[msg.configuration]['package_id'] || conf[msg.configuration]['id'],
        publisher = conf[msg.configuration]['publisher'] || "CN=$username$";

    return AppxmanifestBuilder.set(manifestPath, package_id, name, publisher, msg.localSettings.description).then(function () {
        if(msg.verbose)
            print.success('change .appxmanifest file');
        return msg;
    });
};
