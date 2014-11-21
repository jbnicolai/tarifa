var Q = require('q'),
    path = require('path'),
    os = require('os'),
    tty = require("tty"),
    fs = require('q-io/fs'),
    restler = require('restler'),
    connect = require("connect"),
    serveStatic = require('serve-static'),
    tinylr = require('tiny-lr-fork'),
    findPort = require('find-port'),
    inquirer = require('inquirer'),
    lr = require('connect-livereload'),
    format = require('util').format,
    argsHelper = require('../../lib/helper/args'),
    builder = require('../../lib/builder'),
    print = require('../../lib/helper/print'),
    isAvailableOnHost = require('../../lib/cordova/platforms').isAvailableOnHost,
    pathHelper = require('../../lib/helper/path'),
    runAction = require('../run'),
    buildAction = require('../build'),
    prepareAction = require('../prepare'),
    tarifaFile = require('../../lib/tarifa-file'),
    settings = require('../../lib/settings');

function askHostIp() {
    var defer = Q.defer(),
        interfaces = os.networkInterfaces(),
        interfaceNames = Object.keys(interfaces),
        ips = interfaceNames.map(function (i) {
            return interfaces[i].filter(function (addr) {
                return addr.family === 'IPv4';
            }).map(function (i) { return i.address; });
        }).reduce(function (acc, i) { return acc.concat(i); }, []);

    inquirer.prompt([{
        type:'list',
        name:'ip',
        choices:ips,
        message:'Which ip should be used to serve the configuration?'
    }], function (response) {
        defer.resolve(response.ip);
    });

    return defer.promise;
}

function findLiveReloadPort() {
    var defer = Q.defer(),
        start = settings.livereload_port,
        max = start + settings.livereload_range;

    findPort(start, max, function (ports) {
        if(ports.length > 0) defer.resolve(ports[0]);
        else defer.reject(format('not port found in range [%s, %s]', start, max));
    });

    return defer.promise;
}

function setupLiveReload(msg) {
    var conf = msg.localSettings.configurations[msg.platform][msg.configuration],
        index = pathHelper.wwwFinalLocation(pathHelper.root(), msg.platform),
        app = connect(),
        lrServer = tinylr(),
        serve = serveStatic(index, {index: true});

    lrServer.listen(msg.port, function(err) {
        if(err) print.error('error while starting the live reload server %s', err);
        if(msg.verbose) print.success('started live reload server on %s:%s', msg.ip, msg.port);
    });

    app.use(lr({ port: msg.port }));
    app.use(serve);
    app.listen(settings.default_http_port);

    if(msg.verbose) print.success('started web server on %s:%s', msg.ip, settings.default_http_port);

    return Q.resolve(msg);
}

function run(platform, config, verbose) {
    return function (localSettings) {
        return builder.checkWatcher(pathHelper.root()).then(function (){
            return Q.all([findLiveReloadPort(), askHostIp()]).spread(function (port, ip) {
                return {
                    watch : format('http://%s:%s/index.html', ip, settings.default_http_port),
                    localSettings: localSettings,
                    platform : platform,
                    configuration: config,
                    verbose : verbose,
                    port : port,
                    ip : ip
                };
            });
        })
        .then(setupLiveReload)
        .then(runAction.runƒ)
        .then(function (msg) {
            if (msg.verbose) print.success('run app for watch');
            return msg;
        });
    };
}

function wait(msg) {

    var closeBuilderWatch = builder.watch(pathHelper.root(), function (file) {
        if(msg.verbose) print.success('www project triggering tarifa');

        function onchange() {
            restler.post(format('http://%s:%s/changed', msg.ip, msg.port), {
                data: JSON.stringify({ files: [file] })
            }).on('complete', function(data, response) {
                if (response.statusCode >= 200 && response.statusCode  < 300) {
                    if(msg.verbose) print.success('live reload updated');
                } else {
                    print.error('can not update live reload %s', response.statusCode);
                }
            });
        }

        var copyPromise = (settings.www_link_method[os.platform()] === 'copy')
            ? prepareAction.copy_method(pathHelper.cordova_www(), path.resolve(msg.localSettings.project_output)) : Q.resolve();

        return copyPromise.then(function () {
            return buildAction.prepare(msg);
        }).then(onchange);

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
