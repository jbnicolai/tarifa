var Q = require('q'),
    create = require('../../../../lib/android/keystore').create,
    print = require('../../../../lib/helper/print');

module.exports = function (resp) {
    if (resp.keystore_reuse === undefined || resp.keystore_reuse === true)
        return Q.resolve(resp);

    return create(
        resp.keystore_path,
        resp.keystore_storepass,
        resp.keystore_alias,
        resp.keystore_keypass,
        resp.author_name,
        resp.options.verbose
    ).then(function () {
        if (resp.options.verbose)
            print.success('created keystore');
        return resp;
    });
};
