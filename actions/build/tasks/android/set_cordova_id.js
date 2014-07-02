var Q = require('q'),
    libxmljs = require('libxmljs'),
    chalk = require('chalk'),
    path = require('path'),
    fs = require('fs'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var id = msg.settings.configurations.android[msg.config]['id'];
    var config_xml_path = path.join(process.cwd(), settings.cordovaAppPath, 'config.xml');
    var doc = libxmljs.parseXml(fs.readFileSync(config_xml_path));
    var header = "<?xml version='1.0' encoding='utf-8'?>\n";

    fs.writeFileSync(config_xml_path, header + doc.root().attr('id', id).toString());

    if(msg.verbose)
        console.log(chalk.green('✔') + ' set cordova id to ' + id);
    return Q.resolve(msg);
};
