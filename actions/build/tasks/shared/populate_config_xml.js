var Q = require('q'),
    path = require('path'),
    settings = require('../../../../lib/settings'),
    print = require('../../../../lib/helper/print'),
    mergeObject = require('../../../../lib/helper/collections').mergeObject;
    ConfigBuilder = require('../../../../lib/xml/config.xml');

module.exports = function (msg) {
    var conf = msg.localSettings.configurations[msg.platform][msg.configuration],
        id = conf.id,
        author = msg.localSettings.author.name,
        author_email = msg.localSettings.author.email,
        author_href = msg.localSettings.author.href,
        description = msg.localSettings.description,
        version = conf.version || msg.localSettings.version,
        preferences = msg.localSettings.cordova.preferences,
        accessOrigin = (conf.cordova && conf.cordova.accessOrigin) || msg.localSettings.cordova.accessOrigin,
        config_xml_path = path.join(process.cwd(), settings.cordovaAppPath, 'config.xml');

    if (conf.cordova && conf.cordova.preferences)
        preferences = mergeObject(preferences, conf.cordova.preferences);

    return ConfigBuilder.set(config_xml_path, id, version, author, author_email, author_href, description, preferences, accessOrigin).then(function () {
        if(msg.verbose)
            print.success('modifying config.xml');
        return msg;
    }, function(err) {
        if(msg.verbose) print.error('Error when trying to modify config.xml: ' + err);
        return Q.reject(err);
    });
};
