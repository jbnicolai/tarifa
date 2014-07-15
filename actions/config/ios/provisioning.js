var Q = require('q');
var log = function (name) {
    return function (arg) { console.log(arg); return Q.resolve();};
};

module.exports = {
    fetch : log('fetch'),
    list : log('list')
};
