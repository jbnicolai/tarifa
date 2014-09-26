var Q = require('q'),
    path = require('path'),
    print = require('../../../../lib/helper/print'),
    BuildXml = require('../../../../lib/xml/android/build.xml'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var product_name = msg.localSettings.name,
        build_xml_file_path = path.join(process.cwd(), settings.cordovaAppPath, 'platforms', 'android', 'build.xml');

    return BuildXml.changeName(build_xml_file_path, product_name).then(function () {
        if(msg.verbose)
            print.success('change product_file_name to %s', product_name);
        return msg;
    });
};
