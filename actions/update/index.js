var Q = require('q'),
    path = require('path'),
    os = require('os'),
    fs = require('fs'),
    chalk = require('chalk'),
    argsHelper = require('../../lib/helper/args'),
    pathHelper = require('../../lib/helper/path'),
    tarifaFile = require('../../lib/tarifa-file'),
    cordovaVersion = require('../../lib/cordova/version'),
    cordovaPlatforms = require('../../lib/cordova/platforms'),
    pkg = require('../../package'),
    settings = require('../../lib/settings'),
    intersection = require('interset/intersection'),
    print = require('../../lib/helper/print'),
    plugins = require('../../lib/cordova/plugins'),
    pluginXML = require('../../lib/xml/plugin.xml'),
    pluginAction = require('../plugin').plugin,
    ask = require('../../lib/questions/ask');

function _addInstalledPlatforms(app, platforms, msg) {
    return cordovaVersion.getCordovaPlatformsVersion(app,platforms).then(function (plts) {
        msg.installedPlatforms = {};
        plts.forEach(function (p) {
            msg.installedPlatforms[p.name] = p.version;
        });
        print.line();
        return msg;
    });
}

function versionGreater(version1, version2) {
    var v1 = version1.split('.'),
        v2 = version2.split('.');

    function greater(a, b) { return parseInt(a, 10) > parseInt(b, 10); }
    function smaller(a, b) { return parseInt(a, 10) < parseInt(b, 10); }

    for(var i=0, l=v1.length; i<l; i++) {
        if(greater(v1[i], v2[i])) return true;
        if(smaller(v1[i], v2[i])) return false;
    }
    return false;
}

function _addAvailablePlatforms(platforms) {
    return function (msg) {
        return cordovaVersion.getAvailablePlatformsVersion(platforms).then(function (plts) {
            var availablePlatforms = {};
            plts.forEach(function (p) {
                availablePlatforms[p.name] = p.version;
            });
            var inter = intersection(
                Object.keys(availablePlatforms),
                Object.keys(msg.installedPlatforms)
            );

            print.line(chalk.underline('platforms to update'));
            msg.platformsToUpdate = [];
            inter.forEach(function (name) {
                if(name === 'browser') {
                    // !! do nothing currently no update script in cordova-browser
                }
                else if(versionGreater(availablePlatforms[name], msg.installedPlatforms[name])) {
                    msg.platformsToUpdate.push(name);
                    print.line(
                        '  %s: %s -> %s',
                        name,
                        msg.installedPlatforms[name],
                        availablePlatforms[name]
                    );
                }
            });

            if(!msg.platformsToUpdate.length) print.line('  none');

            print.line();
            return msg;
        });
    };
}

function _addInstalledPlugins(root) {
    return function (msg) {
        return plugins.list(root).then(function (plgs) {
            msg.installedPlugins = plgs;
            return msg;
        });
    };
}

function _pluginVersion(root, p) {
    var pluginPath = path.join(root, settings.cordovaAppPath, 'plugins', p, 'plugin.xml');
    return pluginXML.getVersion(pluginPath);
}

function _addAvailablePlugins(root) {
    return function (msg) {
        var availablePluginsVersions = {},
            availablePlugins = plugins.listAvailable().filter(function (plg) {
                return plg.version;
            }).map(function (plg) {
                availablePluginsVersions[plg.value] = plg.version;
                return plg.value;
            }),
            toUpdate = intersection(availablePlugins, msg.installedPlugins);

        print.line(chalk.underline('default plugins to update'));
        msg.pluginToUpdate = [];
        return toUpdate.reduce(function (promise, p) {
            return promise.then(function () {
                return  _pluginVersion(root, p).then(function (installedVersion) {
                    if(versionGreater(availablePluginsVersions[p], installedVersion)) {
                        msg.pluginToUpdate.push(p);
                        print.line('  %s %s -> %s', p, installedVersion, availablePluginsVersions[p]);
                    }
                    return Q.resolve();
                });
            });
        }, Q.resolve()).then(function () {
            if(!msg.pluginToUpdate.length) print.line('  none');
            print.line();
            return msg;
        });
    };
}

function info(root) {
    return function (msg) {
        var appPath = path.join(root, settings.cordovaAppPath);

        if(msg.verbose) print.line();
        if(msg.verbose) print.line('tarifa version: %s', pkg.version);
        if(msg.verbose) print.line('current project tarifa version: %s', msg.versionObj.current);
        if(msg.verbose) print.line('project created with tarifa version: %s', msg.versionObj.created);

        return _addInstalledPlatforms(appPath, msg.platforms, msg)
            .then(_addAvailablePlatforms(msg.platforms))
            .then(_addInstalledPlugins(root))
            .then(_addAvailablePlugins(root));
    };
}

function askUserForUpdate(root) {
    return function (msg) {
        if(!msg.platformsToUpdate.length && !msg.pluginToUpdate.length) {
            print.success('nothing to update');
            process.exit(0);
        }

        return ask.question('Do you want to update the current project?', 'confirm').then(function (resp) {
            if(resp) return msg;
            else process.exit(0);
        });
    };
}

function runUpdatePlatforms(root) {
    return function (msg) {
        if(!msg.platformsToUpdate.length) return msg;
        return cordovaPlatforms.update(root, msg.platformsToUpdate)
            .then(function () {
                if(msg.verbose) print.success('updated platforms');
                return msg;
            });
    };
}

function runUpdatePlugins(root) {
    return function (msg) {
        var plgs = plugins.listAll();
        return msg.pluginToUpdate.reduce(function (promise, plugin) {
            return promise.then(function () {
                return pluginAction('remove', plugin, msg.verbose);
            }).then(function () {
                var idx = plgs.map(function (p) {
                    return p.value;
                }).indexOf(plugin);

                return pluginAction('add', plgs[idx].uri, msg.verbose);
            });
        }, Q.resolve())
        .then(function () {
            if(msg.pluginToUpdate.length === 0) return msg;
            if(msg.verbose) print.success('updated plugins');
            return msg;
        });
    };
}

function update(verbose) {
    var root = pathHelper.root();

    return tarifaFile.parse(root)
        .then(function (localSettings) {
            return {
                localSettings: localSettings,
                versionObj: JSON.parse(fs.readFileSync(path.join(root, '.tarifa.json'), 'utf-8')),
                platforms: intersection(settings.platforms.filter(function (p) {
                    return settings.os_platforms[p].indexOf(os.platform()) > -1;
                }), localSettings.platforms),
                pluginToUpdate: [],
                platformsToUpdate : [],
                verbose: verbose
            };
        })
        .then(info(root))
        .then(askUserForUpdate(root))
        .then(runUpdatePlatforms(root))
        .then(runUpdatePlugins(root))
        .then(function (msg) {
            fs.writeFileSync(path.join(root, '.tarifa.json'), JSON.stringify({
                current: pkg.version,
                created: msg.versionObj.created
            }));
            if(msg.pluginToUpdate.length || msg.platformsToUpdate.length)
                print.success('update current project');
        });
}

var action = function (argv) {
    var verbose = false,
        helpPath = path.join(__dirname, 'usage.txt');

    if(argsHelper.matchArgumentsCount(argv, [ 0 ])
            && argsHelper.checkValidOptions(argv, ['V', 'verbose'])) {
        if(argsHelper.matchOption(argv, 'V', 'verbose')) {
            verbose = true;
        }
        return update(verbose);
    }

    return fs.read(helpPath).then(print);
};

module.exports = action;
