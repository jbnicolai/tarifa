var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
    print = require('../../../helper/print');

module.exports = function (version, cordovaAppRoot, verbose) {
    var p = path.resolve(__dirname, '../versions', version, 'after_platform_add/index.js');
    return fs.exists(p).then(function (exist) {
        if(exist) {
            if(verbose) print.success('after_platform_add %s', version);
            return require(p)(cordovaAppRoot);
        }
        else {
            return Q();
        }
    });
};
