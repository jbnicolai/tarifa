var Q = require('q'),
    chalk = require('chalk');

module.exports = function (response) {
    if (response.verbose) console.log('\n' + chalk.yellow.bgRed.bold('TODO') + ' create www ');
    return Q.resolve(response);
};
