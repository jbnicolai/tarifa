var Q = require('q'),
    path = require('path'),
    fs = require('q-io/fs'),
    format = require('util').format,
    pathHelper = require('../../../../../helper/path'),
    print = require('../../../../../helper/print'),
    settings = require('../../../../../settings');

module.exports = function (msg) {
    var conf = msg.localSettings.configurations.android[msg.configuration],
        product_name = conf['product_file_name'],
        out_dir = path.join(pathHelper.app(), 'platforms', 'android', 'build', 'apk'),
        signed = msg.localSettings.mode && conf.sign,
        apk_type = signed ? 'release' : (msg.localSettings.mode ? 'release-unsigned' : 'debug-unaligned'),
        apk_name = format('android-%s.apk', apk_type),

        patch = path.join(__dirname, '../../../versions', msg.platformVersion, 'settings.js');

    return fs.exists(patch).then(function (exist) {
        if(exist) out_dir = require(patch).apk_output_folder();
        return out_dir;
    }).then(fs.list)
    .then(function (files) {
        var apks = files.filter(function (file) { return file.match(/\.apk/); });
        if(apks.indexOf(apk_name) < -1) print.warning('apk %s not found in folder %s', apk_name, out_dir);
        return fs.copy(path.resolve(out_dir, apk_name), path.resolve(out_dir, '..', '..', product_name + '.apk'));
    }).then(function () {
        if(msg.verbose) print.success('copy apk %s.apk to %s', product_name, out_dir);
        return msg;
    });
};
