var path = require('path'),
    fs = require('fs'),
    ks = require('../../../../lib/android/keystore');

module.exports = {
    dependency: 'android',
    type:'input',
    name:'keystore_path',
    validate: function (answer) {
        var done = this.async();
        ks.check(path.resolve(answer)).then(function () {
            done(true);
        }, function (reason) {
            done(reason);
        });
    },
    message:'What is the keystore path?'
};
