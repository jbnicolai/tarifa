var Q = require('q'),
    inquirer = require('inquirer'),
    fs = require('q-io/fs'),
    path = require('path'),
    print = require('../helper/print');

module.exports = function (names) {
    var questions = names.map(function (name) {
        return require(path.join(__dirname, 'repository', name));
    });
    return function (answers) {
        return questions.reduce(function (promise, question) {
            var d = Q.defer();
            promise.then(function (answer) {
                if (answer.platforms &&
                    question.dependency &&
                    answer.platforms.indexOf(question.dependency) < 0) {
                    d.resolve(answer); // skip this question
                } else {
                    // if the question is a function it must return a promise,
                    // that means the question needs to do some async tasks
                    // in order to populate the choices
                    if (typeof question === 'function') {
                        question(answer, answer.options.verbose).then(function (qst) {
                            ask(d, qst, answer, answer.options.verbose);
                        }, function (err) { print.error(err); });
                    } else {
                        ask(d, question, answer, answer.options.verbose);
                    }
                }
            });
            return d.promise;
        }, Q.resolve(answers));
    };
};

function ask(defer, question, value, verbose) {
    help(question.name, verbose).then(function () {
        inquirer.prompt([question], function (answer) {
            value[question.name] = answer[question.name];
            // linked question
            if (question.question && value[question.name]) {
                var linked = require(path.join(__dirname, 'repository', question.question)),
                    // if the linked question is a function it must return a promise,
                    // that means the question needs to do some async tasks in
                    // order to populate the choices
                    p = (typeof linked === 'function') ? linked(value, verbose) : Q.resolve(linked);
                p.then(function (qst) {
                    ask(defer, qst, value, verbose);
                }, function (err) {
                    defer.reject(err);
                });
            } else {
                defer.resolve(value);
            }
        });
    });
}

function help(questionName, verbose) {
    if (!verbose) { return Q.resolve(); }
    var helpFile = questionName + '.txt',
        helpPath = path.join(__dirname, 'repository', helpFile);
    return fs.isFile(helpPath).then(function (exists) {
        if (exists) { return fs.read(helpPath).then(print); }
    });
}
