var Q = require('q'),
    path = require('path'),
    tty = require("tty"),
    fs = require('q-io/fs'),
    format = require('util').format,
    argsHelper = require('../../lib/helper/args'),
    builder = require('../../lib/builder'),
    print = require('../../lib/helper/print'),
    isAvailableOnHost = require('../../lib/cordova/platforms').isAvailableOnHost,
    pathHelper = require('../../lib/helper/path'),
    runAction = require('../run'),
    tarifaFile = require('../../lib/tarifa-file');

function setupBrowserSync(msg) {
    var defer = Q.defer(),
        conf = msg.localSettings.configurations[msg.platform][msg.configuration],
        index = pathHelper.wwwFinalLocation(pathHelper.root(), msg.platform),
        config = {
            server: {
                baseDir: index
            },
            port: conf.watch_port,
            ghostMode: false,
            logLevel: 'silent',
            open: false,
            notify: false,
            minify: false,
            host: conf.watch_host
        };

    // TODO launch livereload
    defer.resolve(msg)
    return defer.promise;
}

function run(platform, config, verbose) {
    return function (localSettings) {
        var conf = localSettings.configurations[platform][config];

        if(!conf.watch_port && !conf.watch_host)
            return Q.reject(format('watch_port or/and watch_host are not correctly defined in configuration %s', config));

        var port = conf.watch_port,
            host = conf.watch_host,
            msg = {
                watch : format('http://%s:%s/index.html', host, port),
                localSettings: localSettings,
                platform : platform,
                configuration: config,
                verbose : verbose
            };

        return setupBrowserSync(msg)
            .then(runAction.runƒ)
            .then(function (msg) {
                if (msg.verbose) print.success('run app for watch');
                return msg;
            });
    };
}

function wait(msg) {
    print.todo('waiting for a www build to trigger a to reload');

    builder.watch(pathHelper.root(), function () {
        // TODO trigger livereload refresh
        console.log('change in file from www build system back to tarifa');
    }, msg.localSettings);

    var defer = Q.defer();

    process.openStdin().on("keypress", function(chunk, key) {
        if(key && key.name === "c" && key.ctrl) {
            Q.delay(2000).then(function () {
                print()
                print.todo('stopping tarifa watch...');
                defer.resolve();
            });
        }
    });

    process.stdin.setRawMode();

    process.on('SIGINT', function() {
        Q.delay(200).then(function () {
            print()
            print.todo('stopping tarifa watch...');
            defer.resolve();
        });
    });

    return defer.promise;
}

function watch(platform, config, verbose) {
    return Q.all([
        tarifaFile.parse(pathHelper.root(), platform, config),
        isAvailableOnHost(platform)
    ]).spread(run(platform, config, verbose)).then(wait);
}

var action = function (argv) {
    var verbose = false,
        helpPath = path.join(__dirname, 'usage.txt');

    if(argsHelper.matchArgumentsCount(argv, [1,2])
            && argsHelper.checkValidOptions(argv, ['V', 'verbose'])) {
        if(argsHelper.matchOption(argv, 'V', 'verbose')) {
            verbose = true;
        }
        return watch(argv._[0], argv._[1] || 'default', verbose);
    }

    return fs.read(helpPath).then(print);
};

module.exports = action;
