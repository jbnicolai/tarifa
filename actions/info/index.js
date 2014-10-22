var Q = require('q'),
    chalk = require('chalk'),
    fs = require('q-io/fs'),
    os = require('os'),
    path = require('path'),
    format = require('util').format,
    exec = require('child_process').exec,
    cordova_lazy_load = require('cordova-lib/src/cordova/lazy_load'),
    installed_platforms = require('../../lib/cordova/platforms').installedPlatforms,
    getCordovaPlatformsVersion = require('../../lib/cordova/version').getCordovaPlatformsVersion,
    argsHelper = require('../../lib/helper/args'),
    pathHelper = require('../../lib/helper/path'),
    devices = require('../../lib/devices'),
    settings = require('../../lib/settings'),
    print = require('../../lib/helper/print'),
    tarifaFile = require('../../lib/tarifa-file'),
    pkg = require('../../package.json');

function getToolVersion(name, tool, verbose) {
    var defer = Q.defer(),
        options = {
            timeout : 10000,
            maxBuffer: 1024 * 400
        },
        child = exec(tool, options, function (err, stdout, stderr) {
            if(err) {
                defer.reject(tool + ' ' + err);
                return;
            }
            defer.resolve({
                name: name,
                version: stdout.toString().replace(/\n/g, '')
            });
        });

    return defer.promise;
}

function check_tools(verbose) {
    return function () {
        var rslts = [],
            ok = true,
            bins = settings.external;

        for(var bin in bins) {
            if(bins[bin]['print_version']
                && bins[bin].os_platforms.indexOf(os.platform()) > -1) {
                rslts.push(getToolVersion(
                            bins[bin]['name'],
                            bins[bin]['print_version'],
                            verbose)
                        );
            }
        }

        return Q.allSettled(rslts).then(function (results) {
            results.forEach(function (result) {
                if (result.state === "fulfilled") {
                    print(
                        "%s %s %s",
                        chalk.green(result.value.name),
                        chalk.green('version:'),
                        result.value.version
                    );
                } else {
                    ok = false;
                    print(chalk.cyan('%s not found!'), result.reason.split(' ')[0]);
                    if (verbose) print('\tReason: %s', chalk.cyan(result.reason));
                }
            });
            return Q.resolve(ok);
        });
    };
}

function printiOSDevices (verbose) {
    return function (devicesList) {
        print(
            devicesList.length ? "%s\n\t%s" : "%s %s",
            chalk.green('connected iOS devices:'),
            devicesList.length ? devicesList.join('\n\t') : 'none'
        );
    };
}

function printWPDevices (verbose) {
    return function (devicesList) {
        print(
            devicesList.length ? "%s\n\t%s" : "%s %s",
            chalk.green('available wp devices:'),
            devicesList.length ? devicesList.join('\n\t') : 'none'
        );
    };
}

function printAndroidDevices (verbose) {
    return function (devicesList) {
        if(!devicesList.length) {
            print("%s %s", chalk.green('connected Android devices:'), 'none');
        }
        else if(verbose) {
            print(chalk.green('connected Android devices:'));
            devicesList.forEach(function (dev) {
                print('\t%s', dev.join(' '));
            });
        }
        else {
            print(
                "%s\n\t%s",
                chalk.green('connected Android devices:'),
                devicesList.join('\n\t')
            );
        }
    }
}

function listAvailablePlatforms() {
    var host = os.platform(), r = [];
    for(var p in settings.os_platforms) {
        if(settings.os_platforms[p].indexOf(host) > -1) r.push(p);
    }
    return r;
}

function check_cordova(platforms, verbose) {
    var cordovaLibPaths = platforms.filter(function(p) { return p!== 'web'; }).map(function (platform) {
            return cordova_lazy_load.cordova(platform).then(function (libPath) {
                return {
                    name: platform,
                    path: libPath
                };
            });
        });

    return Q.all(cordovaLibPaths).then(function (libs) {
        libs.forEach(function (lib) {
            print("%s %s", chalk.green(format("cordova %s lib path:", lib.name)), lib.path);
        });
    }, function (err) {
        print.error("Could not check cordova lib. Use --verbose for details");
        if (verbose) print.trace(err);
    });
}

function check_cordova_platform_version(platforms, verbose) {
    return function () {
        return tarifaFile.parse(pathHelper.root()).then(function (localSettings) {
            return getCordovaPlatformsVersion(
                path.join(pathHelper.root(), settings.cordovaAppPath),
                localSettings.platforms.filter(function (p) { return p!=='web'; })
            ).then(function (versions) {
                versions.forEach(function (v) {
                    print("%s %s", chalk.green(format("current project version %s:", v.name)), v.version);
                });
            });
        }, function (err) {
            if(verbose) print.warning(err);
            print.warning("Not in a tarifa project, can't output installed platform versions");
        });
    }
}

function check_requirements(verbose) {
    return function () {
        return installed_platforms(verbose).then(function (platforms) {
            var installed = platforms.filter(function(platform) { return !platform.disabled; })
                .map(function(platform) { return platform.name; });
            if (installed.length)
                print("%s %s", chalk.green("installed platforms on host:"), installed.join(', '));
            var disabled = platforms.filter(function(platform) { return platform.disabled; })
                .map(function(platform) { return platform.name; });
            if (disabled.length)
                print("%s %s", chalk.green("disabled platforms on host:"), disabled.join(', '));
        });
    }
}

function info(verbose) {
    print("%s %s", chalk.green('node version:'), process.versions.node);
    print("%s %s", chalk.green('cordova-lib version:'), pkg.dependencies['cordova-lib']);

    var platforms = listAvailablePlatforms();

    return check_cordova(platforms, verbose)
        .then(check_requirements(platforms, verbose))
        .then(check_cordova_platform_version(platforms, verbose))
        .then(check_tools(verbose))
        .then(function (ok) {
            if(!ok) return Q.reject("not all needed tools are available, first install them!");
            return devices.ios().then(printiOSDevices(verbose))
                .then(function () {
                    if(verbose) return devices.androidVerbose();
                    else return devices.android();
                })
                .then(printAndroidDevices(verbose))
                .then(devices.wp8)
                .then(printWPDevices(verbose));
        });
}

module.exports = function (argv) {
    var verbose = false,
        helpPath = path.join(__dirname, 'usage.txt');

    if(argsHelper.matchArgumentsCount(argv, [0])
            && argsHelper.checkValidOptions(argv, ['V', 'verbose'])) {
        if(argsHelper.matchOption(argv, 'V', 'verbose')) {
            verbose = true;
        }
        return info(verbose);
    }
    return fs.read(helpPath).then(print);
};
