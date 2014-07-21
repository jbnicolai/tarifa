var Q = require('q'),
    ncp = require('ncp').ncp,
    mkdirp = require('mkdirp'),
    path = require('path'),
    fs = require('fs'),
    chalk = require('chalk'),
    settings = require('../settings'),
    exec = require('child_process').exec,
    tarifaFile = require('../tarifa-file');

function copyDefaultTarifaAssets(mapping, platform, config, root, type, verbose) {
    if(!mapping[platform]) return Q.reject("platform not available!");

    var sources = mapping[platform].map(function(tuple) {
            return tuple.src;
        }).reduce(function (acc, source) {
            if(acc.indexOf(source) < 0) acc.push(source);
            return acc;
        }, []);

    return sources.reduce(function (promise, source) {
        var src = path.join(__dirname, '..', '..', 'template', 'assets', platform, source),
            dest = path.join(root, settings.images, platform, config, type, source);
        return promise.then(function () {
            var defer = Q.defer();
            ncp.limit = 1;
            ncp(src, dest, function (err) {
                if (err) return defer.reject(err);
                defer.resolve();
            });
            return defer.promise;
        });
    }, Q.resolve());
}

function copyDefaultAssets(mapping, root, platforms, type, verbose) {
    return platforms.reduce(function (promise, platform) {
        return promise.then(copyDefaultTarifaAssets(mapping, platform, 'default', root, type, verbose))
            .then(function () {
                if(verbose)
                    console.log(chalk.green('✔') + ' default ' + type + ' copied for platform ' + platform);
            });
    }, Q.resolve());
}

function copyAssets(mapping, platform, configuration, type) {
    if(!mapping[platform]) return Q.reject("platform not available!");
    var tarifaPath = path.join(process.cwd(), 'tarifa.json');
    return tarifaFile.parseConfig(tarifaPath).then(function (localSettings) {
        return mapping[platform].reduce(function (promise, tuple) {
            var cwd = process.cwd(),
                imgPath = path.join(cwd, settings.images, platform, configuration),
                config = fs.existsSync(imgPath) ? configuration : 'default',
                src = path.join(cwd, settings.images, platform, config, type, tuple.src),
                relative_path = tuple.dest.replace('{$app_name}', localSettings.name),
                dest = path.join(cwd, settings.cordovaAppPath, 'platforms', platform, relative_path);
            return promise.then(function () {
                var defer = Q.defer();
                ncp.limit = 1;
                mkdirp(path.dirname(dest), function(err) {
                    if (err) return defer.reject(err);
                    ncp(src, dest, function (er) {
                        if (er) return defer.reject(er);
                        defer.resolve();
                    });
                });
                return defer.promise;
            });
        }, Q.resolve());
    });
}

function generateImage(color, size, destination) {
    var options = {
            timeout : 0,
            maxBuffer: 1024 * 400
        },
        defer = Q.defer(),
        cmd = "convert -size " + size + " xc:" + color + " " + destination;

    exec(cmd, options, function (err, stdout, stderr) {
        if(err) {
            if(verbose) {
                console.log(chalk.red('command: ' + cmd));
                console.log('convert stderr ' + stderr);
            }
            defer.reject('convert ' + err);
            return;
        }
        defer.resolve();
    });

    return defer.promise;
};

function generate(mapping, color, type, root, platforms, verbose) {
    var tarifaPath = path.join(process.cwd(), 'tarifa.json');
    return platforms.reduce(function (promise, platform) {
        return promise.then(function () {
            return mapping[platform].reduce(function (promise, tuple) {
                var dest = path.join(root, settings.images, platform, 'default', type, tuple.src),
                    dim = tuple.src.replace('icon-', '').replace('.png', ''),
                    size = type == 'icons' ? (dim + 'x' + dim)
                        : tuple.src.replace('screen-', '').replace('.png', '');
                return promise.then(function () {
                    return generateImage(color, size, dest);
                });
            }, Q.resolve());
        });
    }, Q.resolve());
}

module.exports.generate = generate;
module.exports.copyDefaultAssets = copyDefaultAssets;
module.exports.copyAssets = copyAssets;
