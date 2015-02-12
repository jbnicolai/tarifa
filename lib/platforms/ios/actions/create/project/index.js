var path = require('path'),
    root = __dirname,
    tasks = [
        'tasks/fetch-provisioning-file'
    ];

module.exports.tasks = tasks.map(function (task) {
    return path.resolve(root, task);
});
