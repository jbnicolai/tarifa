var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
    pathHelper = require('../../../../lib/helper/path'),
    print = require('../../../../lib/helper/print'),
    CsprojBuilder = require('../../../../lib/xml/wp8/csproj'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var product_file_name = msg.localSettings.configurations.wp8[msg.configuration]['product_file_name'],
        wp8_path = path.join(pathHelper.app(), 'platforms', 'wp8'),
        value = product_file_name + '.xap';

    return fs.list(wp8_path).then(function (list) {
        var csproj_filename = list.reduce(function (rslt, item) {
            if(item.match(/.*\.csproj$/)) rslt = item;
            return rslt;
        }, null);
        var csproj_path = path.join(wp8_path, csproj_filename);
        return CsprojBuilder.setProductFilename(csproj_path, value);
    }).then(function () {
        if(msg.verbose)
            print.success('change generated XapFilename to %s', product_file_name);
            return msg;
    });
};
