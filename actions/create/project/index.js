var Q = require('q'),
    spinner = require('char-spinner'),
    ask = require('../../../lib/questions/ask'),
    questions = require('../../../lib/questions/list'),
    print = require('../../../lib/helper/print');

function launchTasks(resp) {
    return questions.projectTasks.map(require).reduce(Q.when, resp);
}

function create(verbose) {
    if (verbose) print.banner();
    var response = { options : { verbose : verbose } };
    return ask(questions.project)(response).then(function (resp) {
        print(); spinner();
        return launchTasks(resp);
    });
}

create.launchTasks = launchTasks;
module.exports = create;
