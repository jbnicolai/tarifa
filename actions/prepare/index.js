var Q = require('q'),
    rimraf = require('rimraf'),
    os = require('os'),
    ncp = require('ncp').ncp,
    argsHelper = require('../../lib/helper/args'),
    print = require('../../lib/helper/print'),
    tarifaFile = require('../../lib/tarifa-file'),
    settings = require('../../lib/settings'),
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
        return fs.symbolicLink(cordovaWWW, projectWWW, 'directory');
    }
};

var prepareƒ = function (conf) {
    var cwd = process.cwd(),
        defer = Q.defer(),
        cordovaWWW = path.join(cwd, settings.cordovaAppPath, 'www'),
        projectWWW = path.join(cwd, settings.project_output),
        link_method = settings.www_link_method[os.platform()];

    if (conf.platform !== 'web') {
        // link/copy app www to project output
        rimraf(cordovaWWW, function (err) {
            if(err) defer.reject(err);
            if(conf.verbose) print.success('prepare, rm cordova www folder');
            method[link_method](cordovaWWW, projectWWW).then(function() {
                if(conf.verbose) print.success('prepare, %s www project to cordova www', link_method);
                defer.resolve(conf);
            }, function (err) { defer.reject(err); });
        });
    } else {
        defer.resolve(conf);
    }

    // get www project builder lib
    var builder = require(path.join(cwd, settings.build));
    return defer.promise.then(function (c) {
        if(c.verbose) print.success('prepare, launch www project build');
        // execute www project builder lib with the asked configuration
        return builder(c.platform, c.localSettings, c.configuration, c.verbose);
    }).then(function () { return conf; });
}

var prepare = function (platform, config, verbose) {
    var cwd = process.cwd();
    var tarifaFilePath = path.join(cwd, 'tarifa.json');

    return tarifaFile.parseConfig(tarifaFilePath, platform, config)
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
module.exports = action;
