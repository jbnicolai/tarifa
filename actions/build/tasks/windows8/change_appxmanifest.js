var Q = require('q'),
    path = require('path'),
    fs = require('q-io/fs'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var cwd = process.cwd();
    var manifestPath = path.join(cwd, settings.cordovaAppPath, 'platforms', 'windows8', 'package.appxmanifest');
    var name = msg.localSettings.configurations.windows8[msg.configuration]['product_name'];

    var displayName = "<DisplayName>" + name + "</DisplayName>";
    var displayName2 = "DisplayName=\"" + name + "\"";
    var description = "Description=\"" + msg.localSettings.description + "\"";

    return fs.read(manifestPath).then(function (manifestContent) {
        var content = manifestContent.replace(/<DisplayName>.*<\/DisplayName>/, displayName)
            .replace(/DisplayName=\"([^\"]*)\"/, displayName2)
            .replace(/Description=\"([^\"]*)\"/, description);

        return fs.write(manifestPath, content);
    }).then(function () { return msg; });
};