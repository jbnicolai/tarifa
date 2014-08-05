var Q = require('q'),
    chalk = require('chalk'),
    fs = require('q-io/fs'),
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var product_file_name = msg.settings.configurations.wp8[msg.config]['product_file_name'];
    var wp8_path = path.join(process.cwd(), settings.cordovaAppPath, 'platforms', 'wp8');
    var value = "<XapFilename>" + product_file_name + '.xap' + "</XapFilename>";

    return fs.list(wp8_path).then(function (list) {
        var csproj_filename = list.reduce(function (rslt, item) {
            if(item.match(/.*\.csproj$/)) rslt = item;
            return rslt;
        }, null);
        var csproj_path = path.join(wp8_path, csproj_filename);
        return fs.read(csproj_path).then(function (xmlContent) {
            return fs.write(csproj_path, xmlContent.replace(/<XapFilename>.*<\/XapFilename>/, value)).then(function () {
                if(msg.verbose)
                    print.success('change generated XapFilename to %s', product_file_name);
                    return Q.resolve(msg);
            });
        });
    });
};
