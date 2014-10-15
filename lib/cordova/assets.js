var Q = require('q'),
    ncp = require('ncp').ncp,
    mkdirp = require('mkdirp'),
    path = require('path'),
    fs = require('fs'),
    format = require('util').format,
    chalk = require('chalk'),
    settings = require('../settings'),
    print = require('../helper/print'),
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
                    print.success('default %s copied for platform %s', type, platform);
            });
    }, Q.resolve());
}

function copyAssets(mapping, platform, configuration, type) {
    if(!mapping[platform]) return Q.reject("platform not available!");
    var cwd = process.cwd();
    return tarifaFile.parse(cwd).then(function (localSettings) {
        return mapping[platform].reduce(function (promise, tuple) {
            var confSettings = localSettings.configurations[platform][configuration],
                imgPath = path.join(cwd, settings.images, platform, configuration),
                config = fs.existsSync(imgPath) ? configuration : 'default',
                src = confSettings.assets_path ? path.join(confSettings.assets_path, type, tuple.src) : path.join(cwd, settings.images, platform, config, type, tuple.src),
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

function generateImage(color, size, destination, verbose) {
    var options = {
            timeout : 0,
            maxBuffer: 1024 * 400
        },
        defer = Q.defer(),
        cmd = format("convert -size %s xc:\"%s\" %s", size, color, destination);

    exec(cmd, options, function (err, stdout, stderr) {
        if(err) {
            if(verbose) {
                print.error(cmd);
                print.error('convert stderr %s', stderr);
            }
            defer.reject(err);
            return;
        }
        defer.resolve();
    });

    return defer.promise;
}

function resizeImage(file, size, destination, verbose) {
    var options = {
        timeout : 0,
        maxBuffer: 1024 * 400
    },
    defer = Q.defer(),
    cmd = 'convert ' + file + ' -resize ' + size + '\\> ' + destination;

    exec(cmd, options, function (err, stdout, stderr) {
        if(err) {
            if(verbose) {
                print.error(cmd);
                print.error('convert stderr ' + stderr);
            }
            defer.reject(err);
            return;
        }
        defer.resolve();
    });

    return defer.promise;
}

function checkImageSize(file, verbose) {
    var options = {
        timeout : 0,
        maxBuffer: 1024 * 400
    },
    defer = Q.defer(),
    cmd = 'identify ' + file;

    exec(cmd, options, function (err, stdout, stderr) {
        if(err) {
            if(verbose) {
                print.error(cmd);
                print.error('convert stderr ' + stderr);
            }
            defer.reject('convert ' + err);
            return;
        }
        var res = stdout.split(' ');
        defer.resolve(res[2]);
    });

    return defer.promise;
}

function generate(mapping, color, type, root, platforms, config, verbose) {
    var tarifaPath = path.join(process.cwd(), 'tarifa.json');
    return platforms.reduce(function (promise, platform) {
        return promise.then(function () {
            return mapping[platform].reduce(function (promise, tuple) {
                var dest = path.join(root, settings.images, platform, config, type, tuple.src),
                    dim = tuple.src.replace('icon-', '').replace('.png', ''),
                    size = type == 'icons' ? (dim + 'x' + dim)
                        : tuple.src.replace('screen-', '').replace('.png', '').replace('.jpg', '');
                return promise.then(function () {
                    return generateImage(color, size, dest, verbose);
                });
            }, Q.resolve());
        });
    }, Q.resolve());
}

function generateFromFile(mapping, file, type, root, platforms, config, verbose) {
    var tarifaPath = path.join(process.cwd(), 'tarifa.json');

    return checkImageSize(file).then(function(size) {
       var side = size.split('x')[0];
       if (type === 'icons' && side < 192) {
           return Q.reject('The provided image is too small. It must be a square' +
           'of at least 192px side.');
       }
       return size;
    }).then(function (origSize) {
        origSize = origSize.split('x');

        var mode = (parseInt(origSize[0], 10) > parseInt(origSize[1], 10)) ? 'landscape' : 'portrait';

        return platforms.reduce(function (promise, platform) {
            return promise.then(function () {
                return mapping[platform].reduce(function (promise, tuple) {
                    var dest = path.join(root, settings.images, platform, config, type, tuple.src),
                        dim = tuple.src.replace('icon-', '').replace('.png', ''),
                        size = type == 'icons' ? (dim + 'x' + dim)
                            : tuple.src.replace('screen-', '').replace('.png', '').replace('.jpg', ''),
                        sizeArr = size.split('x').map(function (e) { return parseInt(e, 10); });

                    return promise.then(function () {
                        return resizeImage(file, size, dest, verbose);
                    });
                }, Q.resolve());
            });
        }, Q.resolve());
    });
}

function canGenerate() {
    var defer = Q.defer(),
        cmd = settings.external.convert.print_version,
        options = {
            timeout: 1000 * 10,
            maxBuffer: 1024 * 400
        },
        child = exec(cmd, options, function (err, stdout, stderr) {
            defer.resolve(!err);
        });
    return defer.promise;
}

function createFolder(root, platform, configuration, type) {
    var defer = Q.defer(),
        dirPath = path.join(root, settings.images, platform, configuration, type);
    mkdirp(dirPath, function (err) {
        if(err) return defer.reject("unable to create folder " + err);
        defer.resolve();
    });
    return defer.promise;
}

function createFolders(root, platforms, configuration) {
    var foldersPromises = [];

    platforms.forEach(function (platform) {
        foldersPromises.push(createFolder(root, platform, configuration, 'icons'));
        foldersPromises.push(createFolder(root, platform, configuration, 'splashscreens'));
    });
    return foldersPromises;
}

module.exports.generate = generate;
module.exports.generateFromFile = generateFromFile;
module.exports.canGenerate = canGenerate;
module.exports.copyDefaultAssets = copyDefaultAssets;
module.exports.copyAssets = copyAssets;
module.exports.createFolders = createFolders;
