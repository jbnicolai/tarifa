var Q = require('q'),
fs = require('q-io/fs'),
path = require('path'),
tarifaFile = require('../../lib/tarifa-file'),
pathHelper = require('../../lib/helper/path'),
confHelper = require('../../lib/helper/conf'),
setMode = require('../../lib/helper/setReleaseMode'),
argsHelper = require('../../lib/helper/args'),
hockeyapp = require('../../lib/hockeyapp/hockeyapp'),
print = require('../../lib/helper/print');

var deployƒ = function (conf) {
    conf.localSettings.mode = setMode(conf.platform, conf.configuration, conf.localSettings);
    var productFileName = pathHelper.productFile(
        conf.platform,
        conf.envSettings.product_file_name,
        conf.localSettings.mode
    );
    // TODO refactor to have providers
    return hockeyapp.uploadVersion(productFileName, conf);
};

var deploy = function (platform, verbose) {
    var cwd = process.cwd();
    var tarifaFilePath = path.join(cwd, 'tarifa.json');

    // for now we impose 'stage' env as deploy env... this can change
    var config = 'stage';

    return tarifaFile.parseConfig(pathHelper.current(), platform, config).then(function (localSettings) {
        if (!localSettings.configurations[platform][config].hockeyapp_id)
            return Q.reject('No hockeyapp_id key is available in stage for current platform');

        if (!localSettings.deploy || !localSettings.deploy.hockeyapp_apiurl
        || !localSettings.deploy.hockeyapp_token)
        return Q.reject('No deploy informations are available in the current tarifa.json' +
            'file for the choosen provider (hockeyapp)');

        return deployƒ({
            platform: platform,
            configuration: config,
            localSettings: localSettings,
            envSettings: localSettings.configurations[platform][config],
            verbose: verbose
        });
    });
};

var clean = function(verbose, nbToKeep) {
    var cwd = process.cwd();
    var tarifaFilePath = path.join(cwd, 'tarifa.json');

    return tarifaFile.parseConfig(pathHelper.current()).then(function (localSettings) {
        var appIds = confHelper.findByKey(localSettings, 'hockeyapp_id');
        return hockeyapp.clean(appIds, localSettings, nbToKeep).then(function (total) {
            print.success('Successfully deleted ' + total + ' version(s)');
        });
    });
};

module.exports.deploy = deploy;
module.exports.clean = clean;
