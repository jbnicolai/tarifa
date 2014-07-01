var Q = require('q'),
    libxmljs = require('libxmljs'),
    chalk = require('chalk'),
    path = require('path'),
    fs = require('fs'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var product_name = msg.settings.configurations.android[msg.config]['product_file_name'];
    var build_xml_file_path = path.join(process.cwd(), settings.cordovaAppPath, 'platforms', 'android', 'build.xml');

    var doc = libxmljs.parseXml(fs.readFileSync(build_xml_file_path));
    fs.writeFileSync(build_xml_file_path, doc.root().attr('name', product_name));

    if(msg.verbose)
        console.log(chalk.green('✔') + ' change product_file_name to ' + product_name);
    return Q.resolve(msg);
};
