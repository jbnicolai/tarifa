var Q = require('q'),
    chalk = require('chalk'),
    cordova = require('cordova'),
    argsHelper = require('../../lib/args'),
    settings = require('../../lib/settings'),
    tarifaFile = require('../../lib/tarifa-file'),
    path = require('path'),
    fs = require('fs'),
    prepareAction = require('../prepare');

var tasks = {
    web: {
        'pre-cordova-prepare' : [],
        'pre-cordova-compile' : [],
        'post-cordova-compile' : []
    },
    ios: {
        'pre-cordova-prepare' : [],
        'pre-cordova-compile' : ['product_file_name', 'bundle_id', 'set_code_sign_identity'],
        'post-cordova-compile' : ['run_xcrun', 'undo_set_code_sign_identity']
    },
    android: {
        'pre-cordova-prepare' : ['set_cordova_id', 'change_template_activity'],
        'pre-cordova-compile' : ['product_file_name', 'app_label'],
        'post-cordova-compile' : ['reset_cordova_id']
    }
};

var prepare = function (platform, verbose) {
    return function () {
        if(platform === 'web') return Q.resolve();
        var cwd = process.cwd();
        var defer = Q.defer();

        process.chdir(path.join(cwd, settings.cordovaAppPath));
        if(verbose) console.log(chalk.green('✔') + ' start cordova prepare');

        cordova.prepare({
            verbose: verbose,
            platforms: [ platform ],
            options: []
        }, function (err, result) {
            process.chdir(cwd);
            if(err) defer.reject(err);
            defer.resolve();
        });
        return defer.promise;
    };
};

var compile = function (platform, mode, verbose) {
    return function () {
        if(platform === 'web') return Q.resolve();
        var cwd = process.cwd();
        var defer = Q.defer();
        var options = mode ? [ mode ] : [];

        if(platform === 'ios') options.push('--device');

        process.chdir(path.join(cwd, settings.cordovaAppPath));
        if(verbose) console.log(chalk.green('✔') + ' start cordova build');

        cordova.compile({
            verbose: verbose,
            platforms: [ platform ],
            options: options
        }, function (err, result) {
            process.chdir(cwd);
            if(err) defer.reject(err);
            defer.resolve();
        });
        return defer.promise;
    };
};

var runTasks = function (type, platform, config, localSettings, verbose) {
    return function () {

        if(!tasks[platform][type].length) { return Q.resolve(); }

        return tasks[platform][type].reduce(function (opt, task) {
            return Q.when(opt, require('./tasks/' + platform  + '/' + task));
        }, {
            config: config,
            verbose: verbose,
            settings: localSettings
        });
    };
};

var setMode = function (platform, config, localSettings) {
    var mode = null,
        localConf = localSettings.configurations[platform][config];

    if (platform === 'android' && localConf.keystore_path && localConf.keystore_alias) {
        mode = '--release';
    }
    if(platform === 'ios' && localConf.apple_developer_identity && localConf.provisioning_profile_name) {
        mode = '--release'
    }
};

var build = function (platform, config, verbose) {
    var cwd = process.cwd();
    var tarifaFilePath = path.join(cwd, 'tarifa.json');

    return tarifaFile.parseConfig(tarifaFilePath, platform, config).then(function (localSettings) {
        localSettings.mode = setMode(platform, config, localSettings);

        if(verbose) console.log(chalk.green('✔') + ' start to build the www project');

        return prepareAction.prepare(platform, config, verbose)
            .then(runTasks('pre-cordova-prepare', platform, config, localSettings, verbose))
            .then(prepare(platform, verbose))
            .then(runTasks('pre-cordova-compile', platform, config, localSettings, verbose))
            .then(compile(platform, localSettings.mode, verbose))
            .then(runTasks('post-cordova-compile', platform, config, localSettings, verbose));
    });
};

var action = function (argv) {
    var verbose = false;
    if(argsHelper.matchSingleOptions(argv, 'h', 'help')) {
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    if(argsHelper.matchSingleOptions(argv, 'V', 'verbose')) {
        verbose = true;
    } else if(argv._.length != 1 && argv._.length != 2) {
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    return build(argv._[0], argv._[1] || 'default', verbose);
};

action.build = build;

module.exports = action;
