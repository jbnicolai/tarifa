var Q = require('q'),
    path = require('path');

module.exports.execSequence = function execSequence(tasks) {
    return function (obj) {
        if(!tasks.length) return Q.resolve(obj);
        return tasks.reduce(function (o, task) {
            return Q.when(o, task);
        }, obj);
    };
};

module.exports.execTaskSequence = function execTaskSequence(tasks, attr, type) {
    return function (obj) {
        var p = obj.platform,
            list = type ? tasks[p][attr][type] : tasks[p][attr];
        return execSequence(list.map(function (task) {
            return require(path.join(__dirname, '..', '..', task));
        }));
    };
};
