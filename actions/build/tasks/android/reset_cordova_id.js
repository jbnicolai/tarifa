var Q = require('q'),
    chalk = require('chalk'),
    path = require('path'),
    settings = require('../../../../lib/settings'),
    setId = require('../../../../lib/cordova/config').id;

module.exports = function (msg) {
    var default_id = msg.settings.configurations.android['default']['id'];
    var config_xml_path = path.join(process.cwd(), settings.cordovaAppPath, 'config.xml');

    return setId(config_xml_path, default_id).then(function () {
        if(msg.verbose)
            console.log(chalk.green('✔') + ' reset cordova id to ' + default_id);
        return msg;
    });
};
