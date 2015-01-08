var Q = require('q'),
    inquirer = require('inquirer'),
    fs = require('q-io/fs'),
    path = require('path'),
    print = require('../helper/print');

module.exports = function (fullnames) {
    var questions = fullnames.map(function (fullname) {
        var qst = require(path.join(__dirname, fullname));
        qst.fullname = fullname;
        return qst;
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
    help(question.fullname, verbose).then(function () {
        inquirer.prompt([question], function (answer) {
            value[question.name] = answer[question.name];
            // linked question
            if (question.question && value[question.name]) {
                // if the linked question is a function it must return a promise,
                // that means the question needs to do some async tasks in
                // order to populate the choices
                var linked = require(path.join(__dirname, question.question)),
                    p = (typeof linked === 'function') ? linked(value, verbose) : Q.resolve(linked);
                linked.fullname = question.question;
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

function help(fullname, verbose) {
    if (!verbose) { return Q.resolve(); }
    var helpFile = fullname + '.txt',
        helpPath = path.join(__dirname, helpFile);
    return fs.isFile(helpPath).then(function (exists) {
        if (exists) { return fs.read(helpPath).then(print); }
    });
}
