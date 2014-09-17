var Q = require('q'),
    path = require('path'),
    settings = require('../../../../lib/settings'),
    print = require('../../../../lib/helper/print'),
    setId = require('../../../../lib/cordova/config').id;

module.exports = function (msg) {
    var default_id = msg.localSettings.id;
    var config_xml_path = path.join(process.cwd(), settings.cordovaAppPath, 'config.xml');

    return setId(config_xml_path, default_id).then(function () {
        if(msg.verbose)
            print.success('reset cordova id to %s', default_id);
        return msg;
    });
};
