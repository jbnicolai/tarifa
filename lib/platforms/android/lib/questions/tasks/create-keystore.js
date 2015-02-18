var Q = require('q'),
    create = require('../../keystore').create,
    print = require('../../../../../helper/print');

module.exports = function (resp) {
    if (resp.keystore_reuse === undefined
            || resp.keystore_reuse === true
            || resp.createProjectFromTarifaFile) {
        return Q.resolve(resp);
    }

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
