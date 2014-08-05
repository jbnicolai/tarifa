var Q = require('q'),
    libxmljs = require('libxmljs'),
    path = require('path'),
    fs = require('fs'),
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var product_name = msg.settings.configurations.android[msg.config]['product_file_name'];
    var build_xml_file_path = path.join(process.cwd(), settings.cordovaAppPath, 'platforms', 'android', 'build.xml');

    var doc = libxmljs.parseXml(fs.readFileSync(build_xml_file_path));
    fs.writeFileSync(build_xml_file_path, doc.root().attr('name', product_name));

    if(msg.verbose)
        print.success('change product_file_name to %s', product_name);
    return Q.resolve(msg);
};
