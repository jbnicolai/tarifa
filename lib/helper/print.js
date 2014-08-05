/*
 * print.js
 */
var util = require('util');

module.exports = function (/* format, [ args ... ]*/) {
    var args = Array.prototype.slice.call(arguments, 0);
    util.puts(util.format.apply(this, args));
};
