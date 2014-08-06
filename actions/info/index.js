var Q = require('q'),
    chalk = require('chalk'),
    fs = require('fs'),
    os = require('os'),
    path = require('path'),
    exec = require('child_process').exec,
    argsHelper = require('../../lib/helper/args'),
    devices = require('../../lib/devices'),
    settings = require('../../lib/settings'),
    print = require('../../lib/helper/print'),
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
    var rslts = [],
        ok = true,
        bins = settings.external;

    for(var bin in bins) {
        if(bins[bin].os_platforms.indexOf(os.platform()) > -1) {
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
                print("%s %s %s", chalk.green(result.value.name), chalk.green('version:'), result.value.version);
            } else {
                ok = false;
                print(chalk.cyan('%s not found!'), result.reason.split(' ')[0]);
                if (verbose) print('\tReason: %s', chalk.cyan(result.reason));
            }
        });
        return Q.resolve(ok);
    });
}

module.exports = function (argv) {

    var verbose = false;
    var usage = false;

    for(var a in argv) if(a != 'verbose' && a !="_") usage = true;

    if(argsHelper.matchSingleOption(argv, 'V', 'verbose')) {
        verbose = true;
    } else if(argv._.length != 0 || usage) {
        print(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    print("%s %s", chalk.green('node version:'), process.versions.node);
    print("%s %s", chalk.green('cordova version:'), pkg.dependencies.cordova);

    return check_tools(verbose).then(function (ok) {
        if(!ok) return Q.reject("not all needed tools are available, first install them!");
        return devices.ios().then(function (devices) {
            print("%s\n\t%s", chalk.green('connected iOS devices:'), devices.join('\n\t'));
        }).then(function () {
            if(verbose) return devices.androidVerbose();
            else return devices.android();
        }).then(function (devices) {
            if(verbose) {
                print(chalk.green('connected Android devices:'));
                devices.forEach(function (device) {
                    print('\t%s', device.join(' '));
                });
            }
            else {
                print("%s\n\t%s", chalk.green('connected Android devices:'), devices.join('\n\t'));
            }
        }).then(devices.wp8).then(function (devices) {
            print("%s\n\t%s", chalk.green('available wp devices:'), devices.join('\n\t'));
        });
    });
    // check installed xcode version if available
    // check android sdk version
    // check if we are in a tarifa project
};
