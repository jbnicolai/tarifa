var Q = require('q'),
    print = require('../../../lib/helper/print');

module.exports = function (verbose) {
    if (verbose) print.banner();
    return Q.resolve();
};
