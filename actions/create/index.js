var Q = require('q'),
    inquirer = require('inquirer'),
    chalk = require('chalk'),
    cordova = require('cordova'),
    fs = require('fs'),
    path = require('path'),
    argsHelper = require('../../lib/args'),
    settings = require('../../conf/settings.json'),

    mainQuestions = [
        require('./questions/path'),
        require('./questions/id'),
        require('./questions/name'),
        require('./questions/description'),
        require('./questions/platforms'),
        require('./questions/plugins'),
        require('./questions/www'),
        require('./questions/deploy')
    ],

    customQuestions = [
        require('./questions/custom/build'),
        require('./questions/custom/project_path'),
        require('./questions/custom/project_output')
    ],

    deployQuestions = [
        require('./questions/deploy/apple_id.js'),
        require('./questions/deploy/apple_password.js'),
        require('./questions/deploy/hockeyapp_user.js'),
        require('./questions/deploy/hockeyapp_token.js')
    ],

    tasks = [
        require('./tasks/tarifa'),
        require('./tasks/cordova')
    ],

    verbose = false,
    cwd = process.cwd();

function askQuestions(questions, type) {
    return function (answers) {
        return questions.reduce(function (promise, question) {
            var d = Q.defer();

            promise.then(function (val) {
                if (val.verbose){
                    var helpPath =  path.join(__dirname, 'help', type, question.name + '.txt');
                    if(fs.existsSync(helpPath)) console.log(fs.readFileSync(helpPath, 'utf-8'));
                }
                inquirer.prompt([question], function (answer) {
                    val[question.name] = answer[question.name];
                    d.resolve(val);
                });
            });

            return d.promise;
        }, Q.resolve(answers));
    };
}

function extendWithDefaultSettings(answers) {
    answers.build = settings.build;
    answers.project_path = settings.project_path;
    answers.project_output = settings.project_output;
    return answers;
}

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

    return askQuestions(mainQuestions, '')({ verbose : verbose })
            .then(function (resp) {
                if(resp.www === 'custom') return askQuestions(customQuestions, 'custom')(resp);
                else return extendWithDefaultSettings(resp);
            }).then(function (resp) {
                if(resp.deploy) return askQuestions(deployQuestions, 'deploy')(resp);
                else return resp;
            }).then(function (resp) {
                return tasks.reduce(function (val, task){ return Q.when(val, task); }, resp);
            });
};

module.exports = create;
