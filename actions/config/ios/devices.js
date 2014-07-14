var Q = require('q');
var log = function (name) {
    return function (arg) { console.log(arg); return Q.resolve(); };
};

module.exports = {
    list : log('list'),
    add : log('add'),
    remove : log('remove')
};
