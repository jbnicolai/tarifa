var Q = require('q'),
    path = require('path');

function execSequence (tasks) {
    return function (obj) {
        if(!tasks.length) return Q.resolve(obj);
        return tasks.reduce(function (o, task) {
            return Q.when(o, task);
        }, obj);
    };
};

function execTaskSequence(tasks, attr, type) {
    return function (obj) {
        var p = obj.platform,
            list = type ? tasks[p][attr][type] : tasks[p][attr];
        return execSequence(list.map(function (task) {
            return require(path.join(__dirname, '..', '..', task));
        }))(obj);
    };
}

module.exports = {
    execSequence: execSequence,
    execTaskSequence: execTaskSequence
};
