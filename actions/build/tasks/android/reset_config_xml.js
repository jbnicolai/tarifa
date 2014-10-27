var Q = require('q'),
    path = require('path'),
    settings = require('../../../../lib/settings'),
    pathHelper = require('../../../../lib/helper/path'),
    print = require('../../../../lib/helper/print'),
    ConfigBuilder = require('../../../../lib/xml/config.xml');

module.exports = function (msg) {
    var id = msg.localSettings.id,
        author = msg.localSettings.author.name,
        author_email = msg.localSettings.author.email,
        author_href = msg.localSettings.author.href,
        description = msg.localSettings.description,
        version = msg.localSettings.version,
        preferences = msg.localSettings.cordova.preferences,
        accessOrigin = msg.localSettings.cordova.accessOrigin,
        config_xml_path = path.join(pathHelper.app(), 'platforms', 'android', 'res', 'xml', 'config.xml');

    return ConfigBuilder.set(config_xml_path, id, version, author, author_email, author_href, description, preferences, accessOrigin).then(function () {
        if(msg.verbose)
            print.success('reset android config.xml to global values');
        return msg;
    });
};
