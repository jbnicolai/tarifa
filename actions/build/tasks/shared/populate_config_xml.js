var Q = require('q'),
    path = require('path'),
    settings = require('../../../../lib/settings'),
    print = require('../../../../lib/helper/print'),
    config = require('../../../../lib/cordova/config').config;

module.exports = function (msg) {
    var author = msg.localSettings.author;
    var description = msg.localSettings.description;
    var version = msg.localSettings.version;
    var preferences = msg.localSettings.cordova.preferences;
    var accessOrigin = msg.localSettings.cordova.accessOrigin;
    var config_xml_path = path.join(process.cwd(), settings.cordovaAppPath, 'config.xml');

    return config(config_xml_path, version, author, description, preferences, accessOrigin).then(function () {
        if(msg.verbose)
            print.success('populated config.xml');
        return msg;
    });
};
