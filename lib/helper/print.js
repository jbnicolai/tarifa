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

function trace (err) {
    util.puts(chalk.red(err.stack || err));
}

function success(/* format, [ args ... ]*/) {
    var args = Array.prototype.slice.call(arguments, 0);
    util.print(chalk.green(figures.tick), ' ', util.format.apply(this, args), '\n');
}

function error(/* format, [ args ... ]*/) {
    var args = Array.prototype.slice.call(arguments, 0);
    util.print(chalk.red(figures.cross), ' ', util.format.apply(this, args), '\n');
}

function warning(/* format, [ args ... ]*/) {
    var args = Array.prototype.slice.call(arguments, 0);
    util.print(chalk.bgYellow(chalk.black('warning')), ' ', util.format.apply(this, args), '\n');
}

function banner() {
    print(
chalk.red('  ___       ___    ') + chalk.green('   ___       ___    ') + chalk.magenta('   ___       ___   ') + '\n' +
chalk.red(' /\   \\     /\\  \\   ') + chalk.green('  /\\  \\     /\\  \\   ') + chalk.magenta('  /\\  \\     /\\  \\  ') + '\n' +
chalk.red(' \\:\\  \\   /::\\  \\  ') + chalk.green(' /::\\  \\   _\\:\\  \\  ') + chalk.magenta(' /::\\  \\   /::\\  \\ ') + '\n' +
chalk.red(' /::\\__\\ /::\\:\\__\\ ') + chalk.green('/::\\:\\__\\ /\\/::\\__\\ ') + chalk.magenta('/::\\:\\__\\ /::\\:\\__\\') + '\n' +
chalk.red('/:/\\/__/ \\/\\::/  / ') + chalk.green('\\;:::/  / \\::/\\/__/ ') + chalk.magenta('\\/\\:\\/__/ \\/\\::/  /') + '\n' +
chalk.red('\\/__/      /:/  /  ') + chalk.green(' |:\\/__/   \\:\\__\\   ') + chalk.magenta('   \\/__/    /:/  / ') + '\n' +
chalk.red('           \\/__/   ') + chalk.green('  \\|__|     \\/__/   ') + chalk.magenta('            \\/__/  ')
    );
}

module.exports = print;
module.exports.trace = trace;
module.exports.success = success;
module.exports.error = error;
module.exports.warning = warning;
module.exports.banner = banner;
