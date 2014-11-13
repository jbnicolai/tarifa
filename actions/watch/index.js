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
    buildAction = require('../build'),
    tarifaFile = require('../../lib/tarifa-file');

function setupLiveReload(msg) {
    var conf = msg.localSettings.configurations[msg.platform][msg.configuration],
        index = pathHelper.wwwFinalLocation(pathHelper.root(), msg.platform),
        app = connect(),
        lrServer = tinylr(),
        serve = serveStatic(index, {index: true});

    lrServer.listen(/* FIXME */ 35729, function(err) {
        if(err) print.error('error while starting the live reload server %s', err);
        if(msg.verbose) print.success('started live reload server');
    });

    app.use(lr({ port: 35729 }));
    app.use(serve);
    app.listen(conf.watch_port);

    return Q.resolve(msg);
}

function run(platform, config, verbose) {
    return function (localSettings) {
        var conf = localSettings.configurations[platform][config];

        if(!conf.watch_port && !conf.watch_host)
            return Q.reject(format('watch_port or/and watch_host are not correctly defined in configuration %s', config));

        var msg = {
                watch : format('http://%s:%s/index.html', conf.watch_host, conf.watch_port),
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

    var closeBuilderWatch = builder.watch(pathHelper.root(), function (file) {
        if(msg.verbose) print.success('change www build');

        function onchange() {
            // FIXME use restlet
            request.post('http://localhost:' + 35729 + '/changed', {
                path: '/changed',
                method: 'POST',
                body: JSON.stringify({ files: [file] })
            }, function(err, res, body) {
                if(err) print.error('can not update live reload %s', err);
                if(msg.verbose) print.success('live reload updated');
            });
        }

        return buildAction.prepare(msg).then(onchange);

    }, msg.localSettings, msg.platform, msg.configuration);

    var defer = Q.defer();

    process.openStdin().on("keypress", function(chunk, key) {
        if(key && key.name === "c" && key.ctrl) {
            Q.delay(2000).then(function () {
                print();
                if(msg.verbose) print.success('closing www builder');
                closeBuilderWatch();
                defer.resolve();
            });
        }
    });

    process.stdin.setRawMode();

    process.on('SIGINT', function() {
        Q.delay(200).then(function () {
            print();
            if(msg.verbose) print.success('closing www builder');
            closeBuilderWatch();
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
