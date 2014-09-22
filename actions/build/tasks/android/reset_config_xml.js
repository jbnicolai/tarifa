var Q = require('q'),
    path = require('path'),
    settings = require('../../../../lib/settings'),
    print = require('../../../../lib/helper/print'),
    config = require('../../../../lib/cordova/config').config,
    setId = require('../../../../lib/cordova/config').id;

var config_xml_path = path.join(process.cwd(), settings.cordovaAppPath, 'platforms', 'android', 'res', 'xml', 'config.xml');

module.exports = function (msg) {
    var author = msg.localSettings.author;
    var description = msg.localSettings.description;
    var version = msg.localSettings.version;
    var preferences = msg.localSettings.cordova.preferences;
    var accessOrigin = msg.localSettings.cordova.accessOrigin;

    return setId(config_xml_path, msg.localSettings.id).then(function () {
        return config(config_xml_path, version, author, description, preferences, accessOrigin).then(function () {
            if(msg.verbose)
                print.success('reset android config.xml to global values');
            return msg;
        });
    });
};

