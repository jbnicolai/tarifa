var path = require('path'),
    root = __dirname,
    tasks = [
        'tasks/create-keystore',
        'tasks/git'
    ];

module.exports.tasks = tasks.map(function (task) {
    return path.resolve(root, task);
});
