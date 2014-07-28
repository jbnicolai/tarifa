var Q = require('q'),
    libxmljs = require('libxmljs'),
    chalk = require('chalk'),
    path = require('path'),
    fs = require('fs'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var app_label = msg.settings.configurations.android[msg.config]['product_name'];
    var strings_xml_file_path = path.join(process.cwd(), settings.cordovaAppPath, 'platforms', 'android', 'res', 'values', 'strings.xml');
    var doc = libxmljs.parseXml(fs.readFileSync(strings_xml_file_path));

    doc.root().get('//resources/string[@name="app_name"]').text(app_label);
    fs.writeFileSync(strings_xml_file_path, "<?xml version='1.0' encoding='utf-8'?>\n" + doc.root().toString());

    if(msg.verbose)
        console.log(chalk.green('✔') + ' change product name to ' + app_label);
    return Q.resolve(msg);
};
