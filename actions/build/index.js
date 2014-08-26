var Q = require('q'),
    cordova = require('cordova'),
    argsHelper = require('../../lib/helper/args'),
    print = require('../../lib/helper/print'),
    pathHelper = require('../../lib/helper/path'),
    setMode = require('../../lib/helper/setReleaseMode'),
    settings = require('../../lib/settings'),
    tarifaFile = require('../../lib/tarifa-file'),
    path = require('path'),
    fs = require('q-io/fs'),
    prepareAction = require('../prepare');

var tasks = {
    web: {
        'pre-cordova-prepare-release': [],
        'pre-cordova-prepare' : [],
        'pre-cordova-compile' : [],
        'post-cordova-compile' : []
    },
    wp8: {
        'pre-cordova-prepare-release': [],
        'pre-cordova-prepare' : [
            'wp8/clean',
            'shared/populate_config_xml',
            'shared/copy_icons',
            'shared/copy_splashscreens',
            'shared/set_cordova_id',
            'wp8/change_assembly_info'
        ],
        'pre-cordova-compile' : [
            'wp8/change_manifest',
            'wp8/change_csproj'
        ],
        'post-cordova-compile' : [
            'shared/reset_cordova_id',
            'wp8/run_xap_sign_tool'
        ]
    },
    ios: {
        'pre-cordova-prepare-release': [],
        'pre-cordova-prepare' : [
            'shared/populate_config_xml',
            'shared/copy_icons',
            'shared/copy_splashscreens'
        ],
        'pre-cordova-compile' : [
            'ios/product_file_name',
            'ios/bundle_id',
            'ios/set_code_sign_identity'
        ],
        'post-cordova-compile' : [
            'ios/run_xcrun',
            'ios/undo_set_code_sign_identity'
        ]
    },
    android: {
        'pre-cordova-prepare-release': ['android/bump_version_code'],
        'pre-cordova-prepare' : [
            'shared/populate_config_xml',
            'shared/copy_icons',
            'shared/copy_splashscreens',
            'shared/set_cordova_id',
            'android/change_template_activity'
        ],
        'pre-cordova-compile' : [
            'android/product_file_name',
            'android/app_label'
        ],
        'post-cordova-compile' : [
            'shared/reset_cordova_id'
        ]
    }
};

var prepare = function (conf) {
    if(conf.platform === 'web') return Q.resolve(conf);
    var cwd = process.cwd();
    var defer = Q.defer();

    process.chdir(path.join(cwd, settings.cordovaAppPath));
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
    if(conf.platform === 'web') return Q.resolve(conf);
    var cwd = process.cwd();
    var defer = Q.defer();
    var options = conf.localSettings.mode ? [ conf.localSettings.mode ] : [];

    if(conf.platform === 'ios') options.push('--device');

    process.chdir(path.join(cwd, settings.cordovaAppPath));
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

var runReleaseTasks = function (type) {
    return function (conf) {
        if (conf.localSettings.mode == '--release')
            return runTasks(type)(conf);
        else return Q.resolve(conf);
    };
};

var buildƒ = function (conf){
    conf.localSettings.mode = setMode(conf.platform, conf.configuration, conf.localSettings);

    if(conf.verbose) print.success('start to build the www project');

    return prepareAction.prepareƒ(conf)
        .then(runReleaseTasks('pre-cordova-prepare-release'))
        .then(runTasks('pre-cordova-prepare'))
        .then(prepare)
        .then(runTasks('pre-cordova-compile'))
        .then(compile)
        .then(runTasks('post-cordova-compile'));
};

var build = function (platform, config, verbose) {
    return tarifaFile.parse(pathHelper.root(), platform, config).then(function (localSettings) {
        return buildƒ({
            platform: platform,
            configuration: config,
            localSettings: localSettings,
            verbose: verbose
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
        return build(argv._[0], argv._[1] || 'default', verbose);
    }

    return fs.read(helpPath).then(print);
};

action.build = build;
action.buildƒ = buildƒ;
module.exports = action;
