var Q = require('q'),
    path = require('path');

module.exports.execSequence = function (tasks, attr, type) {
    return function (obj) {
        var p = obj.platform,
            list = type ? tasks[p][attr][type] : tasks[p][attr];
        if(!list.length) return Q.resolve(obj);
        return list.reduce(function (o, task) {
            return Q.when(o, require(path.join(__dirname, '..', '..', task)));
        }, obj);
    };
};
