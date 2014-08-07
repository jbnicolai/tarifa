var Q = require('q'),
    rimraf = require('rimraf'),
    argsHelper = require('../../lib/helper/args'),
    print = require('../../lib/helper/print'),
    tarifaFile = require('../../lib/tarifa-file'),
    settings = require('../../lib/settings'),
    path = require('path'),
    fs = require('q-io/fs');

var prepareƒ = function (conf) {
    var cwd = process.cwd();
    var defer = Q.defer();
    var cordovaWWW = path.join(cwd, settings.cordovaAppPath, 'www');
    var projectWWW = path.join(cwd, settings.project_output);

    if (conf.platform !== 'web') {
        // link app www to project output
        rimraf(cordovaWWW, function (err) {
            if(err) defer.reject(err);
            if(conf.verbose) print.success('prepare, rm cordova www link');
            fs.symbolicLink(cordovaWWW, projectWWW, 'directory').then(function() {
                if(conf.verbose) print.success('prepare, link www project to cordova www');
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
