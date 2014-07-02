var Q = require('q');

module.exports = function (msg) {
    // TODO rm old android package with java activity
    // and generate a new one if the configuration id is not equal the default one
    return Q.resolve(msg);
};
