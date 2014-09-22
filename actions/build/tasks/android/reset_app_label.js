var Q = require('q'),
    libxmljs = require('libxmljs'),
    path = require('path'),
    fs = require('fs'),
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings');

var strings_xml_file_path = path.join(process.cwd(), settings.cordovaAppPath, 'platforms', 'android', 'res', 'values', 'strings.xml');
var doc = libxmljs.parseXml(fs.readFileSync(strings_xml_file_path));

module.exports = function(msg) {
    var app_label = msg.localSettings.name;

    doc.root().get('//resources/string[@name="app_name"]').text(app_label);
    fs.writeFileSync(strings_xml_file_path, "<?xml version='1.0' encoding='utf-8'?>\n" + doc.root().toString());

    if(msg.verbose)
        print.success('reset product name to %s', app_label);
    return Q.resolve(msg);
};
