var Q = require('q'),
    inquirer = require('inquirer'),
    chalk = require('chalk'),
    cordova = require('cordova'),
    fs = require('fs'),
    path = require('path'),
    argsHelper = require('../../lib/args'),
    settings = require('../../conf/settings.json'),

    questions = [
        require('./questions/path'),
        require('./questions/id'),
        require('./questions/name'),
        require('./questions/description'),
        require('./questions/platforms'),
        require('./questions/plugins'),
    ],

    verbose = false,
    cwd = process.cwd();

function create(argv) {

    if(argsHelper.matchSingleOptions(argv, 'h', 'help')) {
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    if(argsHelper.matchSingleOptions(argv, 'V', 'verbose')) {
        verbose = true;
    } else if(argv.length > 1) {
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    var defer = Q.defer();

    inquirer.prompt(questions, function(resp) {
        var cfg = {
                lib : {
                    www : {
                        id : "tarifa",
                        version : "0.0.0",
                        uri : path.join(__dirname, '../../conf/empty-www')
                    }
                }
            },
            cordova_path = path.join(resp.project_path, settings.cordovaAppPath);

        fs.mkdirSync(resp.project_path);
        cordova.create(cordova_path, resp.project_id, resp.project_name, cfg, function (err) {
            if(err) {
                defer.reject(err);
                return;
            }
            if (verbose) console.log('\n' + chalk.green('✔') + ' cordova raw app created here ' + path.resolve(cordova_path));
            process.chdir(cordova_path);
            cordova.platform('add', resp.project_targets, function (err) {
                if(err) {
                    process.chdir(cwd);
                    defer.reject(err);
                    return;
                }
                if (verbose) {
                    resp.project_targets.forEach(function (target) {
                        console.log(chalk.green('✔') + ' cordova platform ' + target + ' added');
                    });
                }
                process.chdir(cwd);
                defer.resolve();
            });
        });
    });

    return defer.promise;
};

module.exports = create;
