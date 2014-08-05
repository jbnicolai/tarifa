var Q = require('q'),
    spinner = require("char-spinner"),
    inquirer = require('inquirer'),
    chalk = require('chalk'),
    cordova = require('cordova'),
    fs = require('fs'),
    path = require('path'),
    argsHelper = require('../../lib/helper/args'),
    print = require('../../lib/helper/print'),

    mainQuestions = [
        require('./questions/path'),
        require('./questions/id'),
        require('./questions/name'),
        require('./questions/description'),
        require('./questions/author_name'),
        require('./questions/author_email'),
        require('./questions/author_href'),
        require('./questions/platforms'),
        require('./questions/plugins'),
        require('./questions/color'),
        require('./questions/deploy')
    ],

    deployQuestions = [
        require('./questions/deploy/apple_developer_identity'),
        require('./questions/deploy/provisioning_profile_path'),
        require('./questions/deploy/apple_id'),
        require('./questions/deploy/has_apple_developer_team'),
        require('./questions/deploy/provisioning_profile_name'),
        require('./questions/deploy/keystore_path'),
        require('./questions/deploy/keystore_alias')
    ],

    tasks = [
        require('./tasks/tarifa'),
        require('./tasks/cordova'),
        require('./tasks/platforms'),
        require('./tasks/plugins'),
        require('./tasks/assets'),
        require('./tasks/ant-properties'),
        require('./tasks/fetch-provisioning-file')
    ],

    verbose = false;

function askQuestions(questions, type) {
    return function (answers) {
        return questions.reduce(function (promise, question) {
            var d = Q.defer(),
                ask = function (q, value, verbose) {
                    if (verbose) {
                        var helpPath =  path.join(__dirname, 'help', type, q.name + '.txt');
                        if(fs.existsSync(helpPath))
                            print(fs.readFileSync(helpPath, 'utf-8'));
                    }
                    inquirer.prompt([q], function (answer) {
                        value[q.name] = answer[q.name];
                        // linked question
                        if(q.question && answer){
                            return ask(require(path.join(__dirname, q.question)), value, verbose);
                        }
                        else {
                            d.resolve(value);
                        }
                    });
                };

            promise.then(function (val) {
                if (val.platforms && question.dependency && val.platforms.indexOf(question.dependency) < 0) {
                    // pass to the next question
                    d.resolve(val);
                }
                else {
                    // if the question is a function it must retrun a promise
                    // that means, the question needs to do some async tasks
                    // in order to populate the choices
                    if(typeof question === 'function') {
                        return question(val, val.options.verbose).then(function (qst) {
                            ask(qst, val, val.options.verbose);
                        }, function (err) {
                            print.error(err);
                        });
                    }
                    else {
                        ask(question, val, val.options.verbose);
                    }
                }
            });
            return d.promise;
        }, Q.resolve(answers));
    };
}

function printBanner() {
    print(
        chalk.bold(chalk.red('t')
        + chalk.green('a')
        + chalk.magenta('r')
        + chalk.cyan('i')
        + chalk.yellow('f')
        + chalk.blue('a'))
        + '\n'
    );
}

function create(argv) {

    if(argsHelper.matchSingleOptions(argv, 'h', 'help')) {
        print(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    if(argsHelper.matchSingleOptions(argv, 'V', 'verbose') && argv._.length < 1) {
        verbose = true;
    } else if(argv._.length >= 1) {
        print(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    if(verbose) printBanner();

    return askQuestions(mainQuestions, '')({ options : { verbose : verbose } })
        .then(function (resp) {
            if(resp.deploy) return askQuestions(deployQuestions, 'deploy')(resp);
            else return resp;
        })
        .then(function (resp) {
            print();
            spinner();
            return tasks.reduce(function (val, task){ return Q.when(val, task); }, resp);
        });
};

module.exports = create;
