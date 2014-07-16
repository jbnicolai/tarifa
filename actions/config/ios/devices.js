var Q = require('q'),
    chalk = require('chalk'),
    spinner = require("char-spinner"),
    ncp = require('ncp').ncp,
    exec = require('child_process').exec,
    path = require('path'),
    fs = require('fs'),
    tarifaFile = require('../../../lib/tarifa-file'),
    askPassword = require('./ask_password');

function getDevices(user, team, password, profile_path, verbose) {
    var defer = Q.defer(),
        options = {
            timeout : 40000,
            maxBuffer: 1024 * 400
        },
        t = (team ?  (" --team " + team) : ''),
        cmd = "ios devices:list -u " + user + " -p "+ password + t;

    exec(cmd, options, function (err, stdout, stderr) {
        if(err) {
            if(verbose) {
                console.log(chalk.red('command: ' + cmd));
            }
            defer.reject('ios stderr ' + err);
            return;
        }

        var output = stdout.toString().split('\n');
        output = output.slice(5, output.length-2);

        output = output.map(function (line) {
            var r = line.split('|').filter(function (w) {
                return w.length > 0;
            });
            return {
                name: r[0],
                uuid: r[1],
                enabled: r[2].trim() === 'Y'
            }
        });

        defer.resolve(output);
    });

    return defer.promise;
}

function listAction(verbose) {
    return askPassword().then(function (password) {
        spinner();
        return tarifaFile.parseConfig(path.join(process.cwd(), 'tarifa.json'))
            .then(function (localSettings) {
                return getDevices(
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

function list(args, verbose) {
    // TODO take into account the long for of the list command
    // `tarifa config ios devices list <configuration>`
    // we should read the provisioning profile file and extract the uuids...

    if(args.length !== 1 && args[0] !== 'list') return usage("Wrong arguments!");
    else return listAction(verbose).then(function (devices) {
        console.log(chalk.underline("\nAll Devices :"));
        devices.forEach(function (device) {
            console.log(
                " %s %s enabled: %s",
                chalk.cyan(device.name),
                chalk.yellow(device.uuid),
                chalk.green(device.enabled)
            );
        });
    });
}

function addDevice(user, team, password, name, uuid, verbose) {
    var defer = Q.defer(),
        options = {
            timeout : 40000,
            maxBuffer: 1024 * 400
        },
        t = (team ?  (" --team " + team) : ''),
        cmd = "ios devices:add " + name + "=" + uuid +" -u " + user + " -p "+ password + t;

    exec(cmd, options, function (err, stdout, stderr) {
        if(err) {
            if(verbose) {
                console.log(chalk.red('command: ' + cmd));
            }
            defer.reject('ios stderr ' + err);
            return;
        }

        var output = stdout.toString();

        defer.resolve(output);
    });

    return defer.promise;
}

function add(args, verbose) {
    // TODO
    // take into account the over variant
    // `tarifa config ios devices add myuuid configuration`

    if(args.length !== 3 || args[0] !== 'add') return usage("Wrong arguments!");

    var name = args[1],
        uuid = args[2];

    return tarifaFile.parseConfig(path.join(process.cwd(), 'tarifa.json'))
        .then(function(localSettings) {
            return askPassword().then(function (password) {
                spinner();
                return addDevice(
                    localSettings.deploy.apple_id,
                    localSettings.deploy.apple_developer_team,
                    password,
                    name,
                    uuid,
                    verbose
                ).then(function (output) { console.log(output); });
            });
        });
}

function remove(args, verbose) {
    if(args.length !== 3 || args[0] !== 'remove') return usage("Wrong arguments!");
    // TODO
    // remove device from provisioning file
    // re fetch provisioning file and overwrite it
    return Q.resolve();
}

module.exports = {
    list : list,
    add: add,
    remove: remove
};
