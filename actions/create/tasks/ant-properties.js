/*
 * create a ant.properties file, needed for the android platform to sign the apk
 */

var path = require('path'),
    Q = require('q'),
    chalk = require('chalk'),
    settings = require('../../../lib/settings');

module.exports = function (response) {
    var cordova_path = path.join(response.path, settings.cordovaAppPath),
        content = '';

    if (response.keystore_path && response.keystore_alias) {
        content += 'key.store=' + response.keystore_path + '\n';
        content += 'key.alias=' + response.keystore_alias;
        fs.writeFileSync(path.join(cordova_path, 'platforms', 'android', 'ant.properties'), content, 'utf-8');
        console.log(chalk.green('✔') + ' ant.properties created');
    }

    return Q.resolve(response);
};
