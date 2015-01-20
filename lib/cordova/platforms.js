var path = require('path'),
    os = require('os'),
    fs = require('q-io/fs'),
    Q = require('q'),
    chalk = require('chalk'),
    os = require('os'),
    cordova_platform_add = require('cordova-lib/src/cordova/platform').add,
    cordova_platform_remove = require('cordova-lib/src/cordova/platform').remove,
    cordova_platform_update = require('cordova-lib/src/cordova/platform').update,
    cordova_util = require('cordova-lib/src/cordova/util'),
    cordova_hooker = require('cordova-lib/src/hooks/HooksRunner'),
    cordova_check = require('./check'),
    print = require('../helper/print'),
    settings = require('../settings');

function copyGradleBuildFile(cordovaRoot) {
    var buildGradlePath = path.resolve(cordovaRoot, 'platforms', 'android', 'build.gradle');

    return fs.remove(buildGradlePath).then(function () {
        return fs.copy(path.resolve(__dirname, 'build.gradle'), buildGradlePath);
    });
}

function copyBuildXcconfigFile(cordovaRoot) {
    return fs.copy(
        path.join(__dirname, 'build.xcconfig'),
        path.join(cordovaRoot, 'platforms', 'ios', 'cordova', 'build.xcconfig')
    );
}

function addPlatforms (root, platforms, verbose) {
    var cwd = process.cwd();

    process.chdir(path.resolve(root, settings.cordovaAppPath));

    var cordovaRoot = cordova_util.cdProjectRoot(),
        hooks = new cordova_hooker(cordovaRoot),
        opts = {
            platforms: platforms,
            spawnoutput: {
                stdio: 'ignore'
            }
        };

    return cordova_platform_add(hooks, cordovaRoot, platforms, opts).then(function () {
        process.chdir(cwd);
    }).then(function () {
        if (platforms.indexOf('android') > -1)
            return copyGradleBuildFile(cordovaRoot);
    }).then(function () {
        if (platforms.indexOf('ios') > -1)
            return copyBuildXcconfigFile(cordovaRoot);
    }).then(function () {
        if (verbose) {
            platforms.forEach(function (target) {
                print.success('cordova platform %s added', target);
            });
        }
        return platforms;
    });
}

function updatePlatforms (root, platforms) {
    var cwd = process.cwd();

    process.chdir(path.resolve(root, settings.cordovaAppPath));

    var cordovaRoot = cordova_util.cdProjectRoot(),
        hooks = new cordova_hooker(cordovaRoot),
        opts = {
            platforms: platforms,
            spawnoutput: {
                stdio: 'ignore'
            }
        };

    return cordova_platform_update(hooks, cordovaRoot, platforms, opts).then(function () {
        process.chdir(cwd);
    }).then(function () { return platforms; });
}

function removePlatforms (root, platforms, verbose) {
    var cwd = process.cwd();

    process.chdir(path.resolve(root, settings.cordovaAppPath));

    var cordovaRoot = cordova_util.cdProjectRoot(),
    hooks = new cordova_hooker(cordovaRoot),
    opts = {
        platforms: platforms,
        spawnoutput: {
            stdio: 'ignore'
        }
    };

    return cordova_platform_remove(hooks, cordovaRoot, platforms, opts).then(function () {
        process.chdir(cwd);
        if (verbose) {
            platforms.forEach(function (target) {
                print.success('cordova platform %s removed', target);
            });
        }
        return platforms;
    });
}

function listPlatforms(root, verbose) {
    var cwd = process.cwd();

    process.chdir(path.resolve(root, settings.cordovaAppPath));

    var projectRoot = cordova_util.cdProjectRoot(),
    platforms_on_fs = cordova_util.listPlatforms(projectRoot);

    return Q.resolve(platforms_on_fs).then(function(platforms) {
        if (verbose) {
            print(chalk.green(platforms.join('\n')));
        }
        process.chdir(cwd);
        return platforms;
    });
}

function isAvailableOnHostSync(platform) {
    return settings.os_platforms[platform]
        && settings.os_platforms[platform].indexOf(os.platform()) > -1;
}

function isAvailableOnHost(platform) {
    if(!settings.os_platforms[platform]) return Q.reject("platform name does not exist");
    return isAvailableOnHostSync(platform) ? Q.resolve(true) : Q.reject("platform not available on your os");
}

function installedPlatforms(verbose) {
    var platforms = settings.platforms.filter(isAvailableOnHostSync);
    return platforms.reduce(function (rslt, item) {
        return Q.when(rslt, function (r) {
            return cordova_check(item).then(function () {
                r.push({ name : item, value : item });
                return r;
            }, function (err) {
                if(verbose) print.error("platform %s %s", item, err);
                r.push({ name : item, value : item, disabled: true });
                return r;
            });
        });
    }, []);
}

function listAvailableOnHost() {
    return installedPlatforms().then(function (platforms) {
        return platforms.filter(function (p) { return !p.disabled; });
    }).then(function (availables) {
        return availables.map(function (p) { return p.name; });
    });
}

module.exports = {
    add: addPlatforms,
    remove: removePlatforms,
    update : updatePlatforms,
    list: listPlatforms,
    isAvailableOnHost: isAvailableOnHost,
    isAvailableOnHostSync: isAvailableOnHostSync,
    installedPlatforms: installedPlatforms,
    listAvailableOnHost: listAvailableOnHost
};
