var Q = require('q'),
fs = require('q-io/fs'),
path = require('path'),
tarifaFile = require('../../lib/tarifa-file'),
pathHelper = require('../../lib/helper/path'),
collsHelper = require('../../lib/helper/collections'),
setMode = require('../../lib/helper/setReleaseMode'),
argsHelper = require('../../lib/helper/args'),
hockeyapp = require('../../lib/hockeyapp/hockeyapp'),
print = require('../../lib/helper/print');

var uploadƒ = function (conf) {
    conf.localSettings.mode = setMode(conf.platform, conf.configuration, conf.localSettings);
    var productFileName = pathHelper.productFile(
        conf.platform,
        conf.envSettings.product_file_name,
        conf.localSettings.mode
    );
    // TODO refactor to have providers
    return hockeyapp.uploadVersion(productFileName, conf);
};

var upload = function (platform, argv, verbose) {
    // for now we impose 'stage' env as deploy env... this can change
    var config = 'stage';

    return tarifaFile.parse(pathHelper.root(), platform, config).then(function (localSettings) {
        if (!localSettings.configurations[platform][config].hockeyapp_id)
            return Q.reject('No hockeyapp_id key is available in stage for current platform');

        if (!localSettings.deploy || !localSettings.deploy.hockeyapp_apiurl
        || !localSettings.deploy.hockeyapp_token)
            return Q.reject('No deploy informations are available in the current tarifa.json' +
                'file for the choosen provider (hockeyapp)');

        // check for hockeyapp options in conf
        var params = {};
        if (localSettings.hockeyapp instanceof Object) {
            params = collsHelper.filterKeys(localSettings.hockeyapp, function (e) {
                return [
                    'versions_notify',
                    'versions_status',
                    'versions_tags',
                    'versions_teams',
                    'versions_users'
                ].indexOf(e) > -1;
            });
            params = collsHelper.mapKeys(params, function (e) {
                return e.replace(/^versions_/, '');
            });
        }

        // get relevant options in cmd args
        var opts = collsHelper.filterKeys(argv, function(e) {
            return ['notes', 'notify', 'status', 'tags', 'teams', 'users'].indexOf(e) > -1;
        });

        params = collsHelper.mergeObject(params, opts);

        return uploadƒ({
            platform: platform,
            configuration: config,
            localSettings: localSettings,
            envSettings: localSettings.configurations[platform][config],
            uploadParams: params,
            verbose: verbose
        });
    });
};

var clean = function(nbToKeep, argv, verbose) {
    return tarifaFile.parse(pathHelper.root()).then(function (localSettings) {
        var appIds = collsHelper.findByKey(localSettings, 'hockeyapp_id');
        return hockeyapp.clean(appIds, localSettings, nbToKeep).then(function (total) {
            print.success('Successfully deleted ' + total + ' version(s)');
        });
    });
};

module.exports.upload = upload;
module.exports.clean = clean;
