var Q = require('q'),
    spinner = require('char-spinner'),
    ask = require('../../../lib/questions/ask'),
    questions = require('../../../lib/questions/list').project,
    print = require('../../../lib/helper/print'),

    tasks = [
        './tasks/tarifa',
        './tasks/cordova',
        './tasks/platforms',
        './tasks/fetch-provisioning-file',
        './tasks/create-keystore',
        './tasks/tarifa-file',
        './tasks/git',
        './tasks/plugins',
        './tasks/assets'
    ];

function launchTasks(resp) {
    return tasks.map(require).reduce(Q.when, resp);
}

function create(verbose) {
    if (verbose) print.banner();
    var response = { options : { verbose : verbose } };
    return ask(questions)(response).then(function (resp) {
        print(); spinner();
        return launchTasks(resp);
    });
}

create.launchTasks = launchTasks;
module.exports = create;
