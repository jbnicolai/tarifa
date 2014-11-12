var Q = require('q'),
    path = require('path'),
    tty = require("tty"),
    fs = require('q-io/fs'),

    request = require('request'),
    connect = require("connect"),
    serveStatic = require('serve-static'),
    tinylr = require('tiny-lr-fork'),
    lr = require('connect-livereload'),

    format = require('util').format,
    argsHelper = require('../../lib/helper/args'),
    builder = require('../../lib/builder'),
    print = require('../../lib/helper/print'),
    isAvailableOnHost = require('../../lib/cordova/platforms').isAvailableOnHost,
    pathHelper = require('../../lib/helper/path'),
    runAction = require('../run'),
    tarifaFile = require('../../lib/tarifa-file');

function setupLiveReload(msg) {
    var defer = Q.defer(),
        conf = msg.localSettings.configurations[msg.platform][msg.configuration],
        index = pathHelper.wwwFinalLocation(pathHelper.root(), msg.platform),
        jsSrc = path.join(__dirname, 'client', 'livereload.js'),
        jsDest = path.join(index, 'livereload.js');

    var app = connect();

    var lrServer = tinylr();

    lrServer.listen(35729, function(err) {
        if(err) console.log(err);
    });

    console.log(index)
    var serve = serveStatic(index, {index: true});

    app.use(require('connect-livereload')({
        port: 35729
    }));

    app.use(serve);

    app.listen(9004);
    defer.resolve(msg);
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

        return setupLiveReload(msg)
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


        request.post('http://localhost:' + 35729 + '/changed', {
            path: '/changed',
            method: 'POST',
            body: JSON.stringify({
              files: []
            })
          }, function(err, res, body) {
            if(err) {
              console.error('Unable to update live reload:', err);
            }
          });


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
