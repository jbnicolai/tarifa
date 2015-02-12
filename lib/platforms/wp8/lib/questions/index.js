var path = require('path'),
    root = __dirname,
    questions = [
        'deploy/wp8_certificate_path'
    ];

module.exports = questions.map(function (question) {
    return path.resolve(root, question);
});
