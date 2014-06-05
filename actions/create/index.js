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

    tasks = [
        require('./tasks/001_tarifa'),
        require('./tasks/002_cordova'),
        require('./tasks/003_www')
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

    var defer = Q.defer(),
        response;

    response = questions.reduce(function (promise, question) {
        var d = Q.defer();

        promise.then(function (val) {
            if (val.verbose){
                var helpPath =  path.join(__dirname, 'help', question.name + '.txt');
                if(fs.existsSync(helpPath)) console.log(fs.readFileSync(helpPath, 'utf-8'));
            }
            inquirer.prompt([question], function (answer) {
                val[question.name] = answer[question.name];
                d.resolve(val);
            });
        });

        return d.promise;
    }, Q.resolve({ verbose : verbose }));

    response.then(function (resp) {
        tasks.reduce(function (val, task){
            return Q.when(val, task);
        }, resp).done(function () {
            defer.resolve();
        }, function (err) {
            defer.reject(err);
        });
    });

    return defer.promise;
};

module.exports = create;
