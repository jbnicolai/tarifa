var path = require('path');

module.exports = [
    'tasks/fetch-provisioning-file'
].map(function (task) {
    return path.resolve(__dirname, task);
});
