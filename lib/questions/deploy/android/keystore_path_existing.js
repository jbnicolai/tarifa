var pathHelper = require('../../../helper/path'),
    ks = require('../../../android/keystore'),
    Configstore = require('configstore'),
    conf = new Configstore('tarifa');

module.exports = {
    dependency: 'android',
    type: 'input',
    name: 'keystore_path',
    validate: function (answer) {
        var done = this.async();
        ks.check(pathHelper.resolve(answer)).then(function () {
            done(true);
        }, function (reason) {
            done(reason);
        });
    },
    filter: function (answer) {
        return pathHelper.resolve(answer);
    },
    message: 'What is the keystore path?',
    default: conf.get('keystore_path')
};
