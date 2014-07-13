var Q = require('q'),
    chalk = require('chalk'),
    fs = require('fs'),
    path = require('path'),
    exec = require('child_process').exec,
    argsHelper = require('../../lib/args'),
    devices = require('../../lib/devices'),
    settings = require('../../lib/settings'),
    pkg = require('../../package.json');

function getToolVersion(name, tool, verbose) {
    var defer = Q.defer(),
        options = {
            timeout : 600,
            maxBuffer: 1024 * 400
        },
        child = exec(tool + ' -v', options, function (err, stdout, stderr) {
            if(err) {
                defer.reject(tool + ' -v ' + err);
                return;
            }
            defer.resolve({
                name: name,
                version: stdout.toString().replace('\n', '')
            });
        });

    if (verbose) child.stderr.pipe(process.stderr);

    return defer.promise;
}

function check_tools(verbose) {
    var rslts = [];
    for(var bin in settings.external) {
        rslts.push(getToolVersion(
                    settings.external[bin]['name'],
                    settings.external[bin]['print_version'],
                    verbose)
                );
    }

    return Q.all(rslts).then(function (results) {
        results.forEach(function (r) {
            console.log(chalk.green(r.name + ' version: ') + r.version);
        });
    }, function (err) {
        console.log(chalk.red('Error: ') + err);
    });
}

module.exports = function (argv) {
    var verbose = false;

    if(argsHelper.matchSingleOptions(argv, 'V', 'verbose', [1,2])) {
        verbose = true;
    } else if(argv._.length != 0) {
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

        console.log(chalk.green('node version:               ') + process.versions.node);
        console.log(chalk.green('cordova version:            ') + pkg.dependencies.cordova);

    return devices.ios().then(function (devices) {
        console.log(chalk.green('connected iOS devices:      \n\t') +  devices.join('\n\t'));
    }).then(devices.android).then(function (devices) {
        console.log(chalk.green('connected Android devices:') +  devices.join('\n\t'));
    }).then(function () {
        return check_tools(verbose);
    });

    // check installed xcode version if available
    // check android sdk version
    // check if we are in a tarifa project
};
