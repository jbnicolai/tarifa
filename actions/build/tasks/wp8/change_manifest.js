var Q = require('q'),
    path = require('path'),
    WMAppManifestBuilder = require('../../../../lib/xml/wp8/WMAppManifest.xml'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var cwd = process.cwd(),
        manifestPath = path.join(cwd, settings.cordovaAppPath, 'platforms', 'wp8', 'Properties', 'WMAppManifest.xml'),
        name = msg.localSettings.configurations.wp8[msg.configuration]['product_name'],
        guid = msg.localSettings.configurations.wp8[msg.configuration]['guid'];


    return WMAppManifestBuilder.set(manifestPath, name, guid).then(function () {
        if(msg.verbose)
            print.success('changed WMAppManifest.xml');
        return msg;
    });
};
