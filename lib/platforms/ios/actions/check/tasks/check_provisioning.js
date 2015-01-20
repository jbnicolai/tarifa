var Q = require('q'),
    print = require('../../../../../helper/print'),
    parse = require('../../../../../ios/parse-mobileprovision');

module.exports = function (msg) {
    var localSettings = msg.settings;
    if (!localSettings.signing || !localSettings.signing.ios)
        return Q.resolve(msg);

    var signing = localSettings.signing.ios;
    return Object.keys(signing).reduce(function (p, k) {
        return p.then(function () {
            return parse(signing[k].provisioning_path);
        });
    }, Q()).then(function () {
        if(msg.verbose) print.success('checked project mobile provisioning files!');
        return msg;
    }, function (err) {
        print.error('check provisioning file failed!');
        return Q.reject(err);
    });
};
