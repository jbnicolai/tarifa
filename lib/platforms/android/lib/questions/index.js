var path = require('path'),
    root = __dirname,
    questions = [
        'deploy/keystore_reuse',
        'deploy/keystore_path_existing',
        'deploy/keystore_path_non_existing',
        'deploy/keystore_storepass',
        'deploy/keystore_alias_list',
        'deploy/keystore_alias',
        'deploy/keystore_keypass'
    ];

module.exports = questions.map(function (question) {
    return path.resolve(root, question);
});
