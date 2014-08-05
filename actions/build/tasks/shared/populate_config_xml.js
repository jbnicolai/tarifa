var Q = require('q'),
    chalk = require('chalk'),
    settings = require('../../../../lib/settings'),
    print = require('../../../../lib/helper/print'),
    config = require('../../../../lib/cordova/config').config;

module.exports = function (msg) {
    var author = msg.settings.author;
    var description = msg.settings.description;
    var version = msg.settings.version;
    var preferences = msg.settings.cordova.preferences;
    var accessOrigin = msg.settings.cordova.accessOrigin;
    var config_xml_path = path.join(process.cwd(), settings.cordovaAppPath, 'config.xml');

    return config(config_xml_path, version, author, description, preferences, accessOrigin).then(function () {
        if(msg.verbose)
            print.success('populated config.xml');
        return msg;
    });
};
