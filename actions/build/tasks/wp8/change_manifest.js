var Q = require('q'),
	path = require('path'),
	fs = require('q-io/fs'),
	settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var cwd = process.cwd();
    var manifestPath = path.join(cwd, settings.cordovaAppPath, 'platforms', 'wp8', 'Properties', 'WMAppManifest.xml');
    var name = msg.localSettings.configurations.wp8[msg.configuration]['product_name'];
    var guid = msg.localSettings.configurations.wp8[msg.configuration]['guid'];

    var title = "<Title>" + name + "</Title>";
    var title2 = "Title=\"" + name + "\"";
    var productId = "ProductID=\"{" + guid + "}\"";

    return fs.read(manifestPath).then(function (manifestContent) {
    	var content = manifestContent.replace(/<Title>.*<\/Title>/, title)
    					.replace(/Title=\"([^\"]*)\"/, title2)
    					.replace(/ProductID=\"{[a-z,A-Z,0-9,-]*}\"/, productId);

    	return fs.write(manifestPath, content);
    }).then(function () { return msg; });
};
