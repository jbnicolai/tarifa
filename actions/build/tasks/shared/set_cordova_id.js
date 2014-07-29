var Q = require('q'),
    chalk = require('chalk'),
    path = require('path'),
    settings = require('../../../../lib/settings'),
    setId = require('../../../../lib/cordova/config').id;

module.exports = function (msg) {
    var id = msg.settings.configurations[msg.platform][msg.config]['id'];
    var config_xml_path = path.join(process.cwd(), settings.cordovaAppPath, 'config.xml');

    return setId(config_xml_path, id).then(function () {
        if(msg.verbose)
            console.log(chalk.green('✔') + ' set cordova id to ' + id);
        return msg;
    });
};
