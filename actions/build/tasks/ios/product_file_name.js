var Q = require('q');

module.exports = function (msg) {
    console.log('try to change product_file_name for ios');
    return Q.resolve(msg);
};
