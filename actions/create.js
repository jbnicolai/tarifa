var Q = require('q');

module.exports = function (argv) {
    // do the stuff
    console.log(argv);

    return Q.resolve("ohh yessssss");
};
