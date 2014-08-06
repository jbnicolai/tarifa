var Q = require('q'),
    path = require('path'),
    settings = require('../../../../lib/settings'),
    print = require('../../../../lib/helper/print'),
    setId = require('../../../../lib/cordova/config').id;

module.exports = function (msg) {
    var id = msg.localSettings.configurations[msg.platform][msg.configuration]['id'];
    var config_xml_path = path.join(process.cwd(), settings.cordovaAppPath, 'config.xml');

    return setId(config_xml_path, id).then(function () {
        if(msg.verbose)
            print.success('set cordova id to %s', id);
        return msg;
    });
};
