var Q = require('q'),
    spinner = require('char-spinner'),
    ask = require('../../../lib/questions/ask'),
    questions = require('../../../lib/questions/list'),
    createProject = require('../../../lib/create'),
    print = require('../../../lib/helper/print');

function create(verbose) {
    if (verbose) print.banner();

    var initResponse = {
        options : {
            verbose : verbose
        }
    };

    return ask(questions.project)(initResponse).then(function (response) {
        print(); spinner();
        return response;
    }).then(createProject.createFromResponse);
}

module.exports = create;
