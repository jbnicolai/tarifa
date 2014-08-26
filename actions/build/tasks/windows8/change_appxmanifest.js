var Q = require('q'),
    path = require('path'),
    fs = require('q-io/fs'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var cwd = process.cwd();
    var conf = msg.localSettings.configurations.windows8;
    var manifestPath = path.join(cwd, settings.cordovaAppPath, 'platforms', 'windows8', 'package.appxmanifest');
    var name = conf[msg.configuration]['product_name'];
    var package_id = conf[msg.configuration]['package_id'] || conf[msg.configuration]['id'];
    var publisher = conf[msg.configuration]['publisher'] || "CN=$username$";

    var publisherAttr = "Publisher=\"" + publisher + "\""; 
    var displayName = "<DisplayName>" + name + "</DisplayName>";
    var identity = "Identity Name=\"" + package_id + "\"";
    var displayName2 = "DisplayName=\"" + name + "\"";
    var description = "Description=\"" + msg.localSettings.description + "\"";

    return fs.read(manifestPath).then(function (manifestContent) {
        var content = manifestContent.replace(/<DisplayName>.*<\/DisplayName>/, displayName)
            .replace(/Publisher=\"([^\"]*)\"/, publisherAttr)
            .replace(/Identity Name=\"([^\"]*)\"/, identity)
            .replace(/DisplayName=\"([^\"]*)\"/, displayName2)
            .replace(/Description=\"([^\"]*)\"/, description);

        return fs.write(manifestPath, content);
    }).then(function () { return msg; });
};