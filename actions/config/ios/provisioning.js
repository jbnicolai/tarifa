var Q = require('q'),
    chalk = require('chalk'),
    exec = require('child_process').exec,
    path = require('path'),
    fs = require('fs'),
    tarifaFile = require('../../../lib/tarifa-file'),
    askPassword = require('./ask_password');

function getProvisioningProfileList(user, team, password, verbose) {
    var defer = Q.defer(),
        options = {
            timeout : 40000,
            maxBuffer: 1024 * 400
        },
        t = (team ?  (" --team " + team) : ''),
        cmd = "ios profiles:list -u " + user + " -p "+ password + t;

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
                            return [elts[1].trim(), elts[2].trim()];
                        });

        defer.resolve(output);
    });

    return defer.promise;
}

function list(verbose) {
    return askPassword().then(function (password) {
        return tarifaFile.parseFromFile(path.join(process.cwd(), 'tarifa.json'))
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
        console.log();
        items.forEach(function (item) {
            console.log("appid: %s name: %s ", chalk.yellow(item[1]), chalk.cyan(item[0]));
        });
    });
}

module.exports = {
    fetch : function (args, verbose) { return Q.resolve(); },
    list : printList
};
