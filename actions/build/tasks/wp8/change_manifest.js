var Q = require('q'),
	path = require('path'),
	fs = require('q-io/fs'),
	settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var cwd = process.cwd();
    var manifestPath = path.join(cwd, settings.cordovaAppPath, 'platforms', 'wp8', 'Properties', 'WMAppManifest.xml');
    var name = msg.settings.configurations.wp8[msg.config]['product_name'];
    var guid = msg.settings.configurations.wp8[msg.config]['guid'];

    var title = "<Title>" + name + "</Title>";
    var title2 = "Title=\"" + name + "\"";
    var productId = "ProductID=\"{" + guid + "}\"";
    
    return fs.read(manifestPath).then(function (manifestContent) {
    	var content = manifestContent.replace(/<Title>.*<\/Title>/, title)
    					.replace(/Title=\"[a-z,A-Z,0-9, ]*\"/, title2)
    					.replace(/ProductID=\"{[a-z,A-Z,0-9,-]*}\"/, productId);

    	return fs.write(manifestPath, content);
    }).then(function () { return msg; });
};