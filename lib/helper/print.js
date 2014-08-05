/*
 * print.js
 */
var util = require('util'),
    figures = require('figures'),
    chalk = require('chalk');

module.exports = function print(/* format, [ args ... ]*/) {
    var args = Array.prototype.slice.call(arguments, 0);
    util.puts(util.format.apply(this, args));
};

module.exports.success = function (/* format, [ args ... ]*/) {
    var args = Array.prototype.slice.call(arguments, 0);
    util.print(chalk.green(figures.tick), ' ', util.format.apply(this, args), '\n');
};

module.exports.error = function (/* format, [ args ... ]*/) {
    var args = Array.prototype.slice.call(arguments, 0);
    util.print(chalk.red(figures.cross), ' ', util.format.apply(this, args), '\n');
};
