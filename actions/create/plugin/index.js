var Q = require('q'),
    ask = require('../../../lib/questions/ask'),
    print = require('../../../lib/helper/print'),

    questions = [
        'plugin/path',
        'plugin/id',
        'plugin/platforms',
        'plugin/name',
        'plugin/description',
        'plugin/author_name',
        'plugin/keywords',
        'plugin/license'
    ];

module.exports = function (verbose) {
    if (verbose) print.banner();
    return ask(questions)({ options : { verbose : verbose } })
        .then(function (resp) {
            return resp;
        });
};
