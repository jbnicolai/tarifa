var Q = require('q'),
    chalk = require('chalk'),
    spinner = require("char-spinner"),
    ncp = require('ncp').ncp,
    exec = require('child_process').exec,
    path = require('path'),
    fs = require('fs'),
    tarifaFile = require('../../../lib/tarifa-file'),
    provisionFileParse = require('../../../lib/parse-mobileprovision'),
    askPassword = require('./ask_password');

function getProvisioningProfileList(user, team, password, verbose) {
    var defer = Q.defer(),
        options = {
            timeout : 40000,
            maxBuffer: 1024 * 400
        },
        t = (team ?  (" --team " + team) : ''),
        cmd = "ios profiles:list -u " + user + " -p "+ password + t + ' --type distribution';

    exec(cmd, options, function (err, stdout, stderr) {
        if(err) {
            if(verbose) {
                console.log(chalk.red('command: ' + cmd));
            }
            defer.reject('ios stderr ' + err);
            return;
        }

        var output = stdout.toString()
                        .split('\n')
                        .filter(function (line) {
                            return line.search("Active") >= 0;
                        })
                        .map(function (line) {
                            var elts = line.split('|');
                            return [elts[1], elts[2]];
                        });

        defer.resolve(output);
    });

    return defer.promise;
}

function list(verbose) {
    return askPassword().then(function (password) {
        spinner();
        return tarifaFile.parseConfig(path.join(process.cwd(), 'tarifa.json'))
            .then(function (localSettings) {
                return getProvisioningProfileList(
                    localSettings.deploy.apple_id,
                    localSettings.deploy.apple_developer_team,
                    password,
                    verbose
                );
            });
    });
}

function usage(msg) {
    console.log(fs.readFileSync(path.join(__dirname , '..', 'usage.txt'), 'utf-8'));
    return Q.reject(msg);
}

function printList(args, verbose) {
    if(args.length !== 1 && args[0] !== 'list') return usage("Wrong arguments!");
    else return list(verbose).then(function (items) {
        console.log(chalk.underline("\nActive provisioning profiles:"));
        items.forEach(function (item) {
            console.log("appid: %s name: %s ", chalk.yellow(item[1]), chalk.cyan(item[0]));
        });
    });
}

function downloadProvisioningProfile(user, team, password, profile_path, verbose) {
    return provisionFileParse(profile_path).then(function(provision) {
        var name = provision.name,
            defer = Q.defer(),
            options = {
                timeout : 40000,
                maxBuffer: 1024 * 400
            },
            t = (team ?  (" --team " + team) : ''),
            cmd = "ios profiles:download " + name + " -u " + user + " -p "+ password + t + ' --type distribution';

        exec(cmd, options, function (err, stdout, stderr) {
            if(err) {
                if(verbose) {
                    console.log(chalk.red('command: ' + cmd));
                }
                defer.reject('ios stderr ' + err);
                return;
            }
            if (verbose) console.log('try to copy provision');
            ncp.limit = 1;
            var src = path.join(process.cwd(), name.replace(/-/g,'')+'.mobileprovision');
            if(src === profile_path) return defer.resolve('done');

            ncp(path.join(process.cwd(), name.replace(/-/g,'')+'.mobileprovision'), profile_path, function (err) {
                if (err) return defer.reject(err);
                if (verbose)
                    console.log(chalk.green('✔') + ' provisioning profile fetched');
                var output = stdout.toString();
                if (verbose) console.log(output);
                defer.resolve(output);
            });
        });
        return defer.promise;
    });
}

function fetch(args, verbose) {
    if(args.length !== 2 && args[0] !== 'fetch') {
        return usage("Wrong arguments!");
    }
    var name = args[0],
        conf = args[1];

    return tarifaFile.parseConfig(path.join(process.cwd(), 'tarifa.json')).then(function (localSettings) {
        if(!localSettings.configurations['ios'][conf]) {
            return Q.reject('Error: configuration ' + conf + 'not found!');
        } else {
            return askPassword().then(function (password) {
                return [password, localSettings];
            });
        }
    }).spread(function (password, localSettings) {
        spinner();
        return downloadProvisioningProfile(
            localSettings.deploy.apple_id,
            localSettings.deploy.apple_developer_team,
            password,
            localSettings.configurations['ios'][conf].provisioning_profile,
            verbose
        );
    });

    return Q.resolve();
}

module.exports = {
    fetch : fetch,
    list : printList,
    downloadProvisioningProfile: downloadProvisioningProfile
};
