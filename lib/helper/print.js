/*
 * print.js
 */
var util = require('util'),
    figures = require('figures'),
    chalk = require('chalk');

function print (/* format, [ args ... ]*/) {
    var args = Array.prototype.slice.call(arguments, 0);
    util.puts(util.format.apply(this, args));
}

function success(/* format, [ args ... ]*/) {
    var args = Array.prototype.slice.call(arguments, 0);
    util.print(chalk.green(figures.tick), ' ', util.format.apply(this, args), '\n');
}

function error(/* format, [ args ... ]*/) {
    var args = Array.prototype.slice.call(arguments, 0);
    util.print(chalk.red(figures.cross), ' ', util.format.apply(this, args), '\n');
}

function banner() {
    print(
        chalk.bold(chalk.red('t')
        + chalk.green('a')
        + chalk.magenta('r')
        + chalk.cyan('i')
        + chalk.yellow('f')
        + chalk.blue('a'))
        + '\n'
    );
}

module.exports = print;
module.exports.success = success;
module.exports.error = error;
module.exports.banner = banner;
