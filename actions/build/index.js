var Q = require('q'),
    cordova = require('cordova-lib/src/cordova/cordova'),
    argsHelper = require('../../lib/helper/args'),
    print = require('../../lib/helper/print'),
    pathHelper = require('../../lib/helper/path'),
    getMode = require('../../lib/helper/getReleaseMode'),
    settings = require('../../lib/settings'),
    tarifaFile = require('../../lib/tarifa-file'),
    path = require('path'),
    fs = require('q-io/fs'),
    prepareAction = require('../prepare'),
    platformsLib = require('../../lib/cordova/platforms');

// set android build to gradle!!!
process.env.ANDROID_BUILD = 'gradle';

var tasks = {
    browser: {
        'pre-cordova-prepare' : ['shared/populate_config_xml'],
        'pre-cordova-compile' : [],
        'post-cordova-compile' : [],
        'undo':['shared/reset_config_xml']
    },
    wp8: {
        'pre-cordova-prepare' : [
            'shared/clean',
            'shared/populate_config_xml',
            'shared/copy_icons',
            'shared/copy_splashscreens',
            'wp8/change_assembly_info'
        ],
        'pre-cordova-compile' : [
            'wp8/change_manifest',
            'wp8/change_csproj'
        ],
        'post-cordova-compile' : [
            'wp8/run_xap_sign_tool'
        ],
        'undo':[
            'shared/reset_config_xml'
        ]
    },
    ios: {
        'pre-cordova-prepare' : [
            'shared/populate_config_xml',
            'shared/copy_icons',
            'shared/copy_splashscreens',
            'shared/clean'
        ],
        'pre-cordova-compile' : [
            'ios/product_file_name',
            'ios/bundle_id',
            'ios/set_code_sign_identity'
        ],
        'post-cordova-compile' : [
            'ios/run_xcrun'
        ],
        'undo':[
            'ios/undo_set_code_sign_identity',
            'shared/reset_config_xml'
        ]
    },
    android: {
        'pre-cordova-prepare' : [
            'android/clean_output_dir',
            'shared/populate_config_xml',
            'shared/copy_icons',
            'shared/copy_splashscreens',
            'android/change_template_activity',
            'android/release-properties'
        ],
        'pre-cordova-compile' : [
            'android/app_label'
        ],
        'post-cordova-compile' : [
            'android/copy_apk'
        ],
        'undo':[
            'shared/reset_config_xml',
            'android/reset_config_xml',
            'android/reset_template_activity',
            'android/reset_app_label',
            'android/reset_release_properties'
        ]
    }
};

var prepare = function (conf) {
    var cwd = process.cwd();
    var defer = Q.defer();

    process.chdir(pathHelper.app());
    if(conf.verbose) print.success('start cordova prepare');

    cordova.prepare({
        verbose: conf.verbose,
        platforms: [ conf.platform ],
        options: []
    }, function (err, result) {
        process.chdir(cwd);
        if(err) defer.reject(err);
        defer.resolve(conf);
    });
    return defer.promise;
};

var compile = function (conf) {
    if(conf.platform === 'browser') return Q.resolve(conf);
    var cwd = process.cwd();
    var defer = Q.defer();
    var options = conf.localSettings.mode ? [ conf.localSettings.mode ] : [];

    if(conf.platform === 'ios') options.push('--device');

    process.chdir(pathHelper.app());
    if(conf.verbose) print.success('start cordova build');

    cordova.compile({
        verbose: conf.verbose,
        platforms: [ conf.platform ],
        options: options
    }, function (err, result) {
        process.chdir(cwd);
        if(err) defer.reject(err);
        defer.resolve(conf);
    });
    return defer.promise;
};

var runTasks = function (type) {
    return function (conf) {
        if(!tasks[conf.platform][type].length) { return Q.resolve(conf); }

        return tasks[conf.platform][type].reduce(function (opt, task) {
            return Q.when(opt, require('./tasks/' + task));
        }, conf);
    };
};

var buildƒ = function (conf){
    conf.localSettings.mode = getMode(conf.platform, conf.configuration, conf.localSettings);

    if(conf.verbose) print.success('start to build the www project');

    var cwd = process.cwd();
    process.chdir(pathHelper.root());
    return prepareAction.prepareƒ(conf)
        .then(runTasks('pre-cordova-prepare'))
        .then(prepare)
        .then(runTasks('pre-cordova-compile'))
        .then(compile)
        .then(runTasks('post-cordova-compile'))
        .then(function () {
            process.chdir(cwd);
            if (conf.keepFileChanges) return Q.resolve(conf);
            else return runTasks('undo')(conf);
        }, function (err) {
            process.chdir(cwd);
            if(conf.verbose) print.error('build action chain failed, start undo tasks...');
            return runTasks('undo')(conf).then(function () {
                return Q.reject(err);
            });
        });
};

var build = function (platform, config, keepFileChanges, verbose) {
    return tarifaFile.parse(pathHelper.root(), platform, config).then(function (localSettings) {
        return buildƒ({
            platform: platform,
            configuration: config,
            localSettings: localSettings,
            keepFileChanges: keepFileChanges,
            verbose: verbose
        });
    });
};

var buildAll = function (config, keepFileChanges, verbose) {
    return tarifaFile.parse(pathHelper.root()).then(function (localSettings) {
        return localSettings.platforms.filter(platformsLib.isAvailableOnHostSync)
        .reduce(function(promise, platform) {
            return promise.then(function () {
                print.outline('Launch build for ' + platform + ' platform!');
                return build(platform, config, keepFileChanges, verbose);
            });
        }, Q());
    });
};

var action = function (argv) {
    var verbose = false,
        keepFileChanges = false,
        helpPath = path.join(__dirname, 'usage.txt');

    if(argsHelper.matchArgumentsCount(argv, [1,2]) &&
    argsHelper.checkValidOptions(argv, ['V', 'verbose', 'keep-file-changes'])) {
        if(argsHelper.matchOption(argv, 'V', 'verbose')) {
            verbose = true;
        }
        if(argsHelper.matchOption(argv, null, 'keep-file-changes')) {
            keepFileChanges = true;
        }
        if (argv._[1])
            return build(argv._[1], argv._[0], keepFileChanges, verbose);
        else
            return buildAll(argv._[0], keepFileChanges, verbose);
    }

    return fs.read(helpPath).then(print);
};

action.build = build;
action.buildAll = buildAll;
action.buildƒ = buildƒ;
action.prepare = prepare;
module.exports = action;
