var path = require('path');

module.exports = [
    'tasks/create-keystore'
].map(function (task) {
    return path.resolve(__dirname, task);
});
