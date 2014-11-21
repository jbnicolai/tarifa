var Q = require('q'),
    rimraf = require('rimraf'),
    os = require('os'),
    ncp = require('ncp').ncp,
    argsHelper = require('../../lib/helper/args'),
    print = require('../../lib/helper/print'),
    tarifaFile = require('../../lib/tarifa-file'),
    pathHelper = require('../../lib/helper/path'),
    settings = require('../../lib/settings'),
    builder = require('../../lib/builder'),
    path = require('path'),
    fs = require('q-io/fs');

var method = {
    copy: function (cordovaWWW, projectWWW) {
        var defer = Q.defer();
        ncp.limit = 1024;
        ncp(projectWWW, cordovaWWW, function (err) {
            if (err) return defer.reject(err);
            defer.resolve();
        });
        return defer.promise;
    },
    link : function (cordovaWWW, projectWWW) {
        return fs.symbolicCopy(projectWWW, cordovaWWW, 'directory');
    }
};

var prepareƒ = function (conf) {
    var cordovaWWW = path.join(pathHelper.app(), 'www'),
        projectWWW = path.join(pathHelper.root(), conf.localSettings.project_output),
        link_method = settings.www_link_method[os.platform()];

    if(conf.verbose) print.success('prepare, launch www project build');
    return builder.build(pathHelper.root(), conf.platform, conf.localSettings, conf.configuration, conf.verbose).then(function () {
        var defer = Q.defer();
        rimraf(cordovaWWW, function (err) {
            if(err) defer.reject(err);
            if(conf.verbose) print.success('prepare, rm cordova www folder');
            // link/copy app www to project output
            method[link_method](cordovaWWW, projectWWW).then(function() {
                if(conf.verbose) print.success('prepare, %s www project to cordova www', link_method);
                defer.resolve(conf);
            }, function (err) { defer.reject(err); });
        });
        return defer.promise;
    });
};

var prepare = function (platform, config, verbose) {
    return tarifaFile.parse(pathHelper.root(), platform, config)
        .then(function (localSettings) {
            return prepareƒ({
                localSettings: localSettings,
                platform : platform,
                configuration: config,
                verbose : verbose
            });
        });
};

var action = function (argv) {
    var verbose = false,
        helpPath = path.join(__dirname, 'usage.txt');

    if(argsHelper.matchArgumentsCount(argv, [1,2])
            && argsHelper.checkValidOptions(argv, ['V', 'verbose'])) {
        if(argsHelper.matchOption(argv, 'V', 'verbose')) {
            verbose = true;
        }
        return prepare(argv._[0], argv._[1] || 'default', verbose);
    }
    return fs.read(helpPath).then(print);
};

action.prepare = prepare;
action.prepareƒ = prepareƒ;
action.copy_method = method[settings.www_link_method[os.platform()]];
module.exports = action;
