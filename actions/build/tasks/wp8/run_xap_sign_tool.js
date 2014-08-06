var Q = require('q'),
    exec = require('child_process').exec,
    path = require('path'),
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var conf = msg.localSettings.configurations.wp8[msg.configuration];
    var release_mode = conf['release_mode'];
    var sign_mode = conf['sign_mode'];

    if(!release_mode || !sign_mode) return Q.resolve(msg);

    var product_file_name = conf['product_file_name'] + '.xap',
        output = path.join(process.cwd(), settings.cordovaAppPath, 'platforms', 'wp8', 'bin', 'Release', product_file_name),
        bin = path.resolve('/','Program Files\ (x86)', 'Microsoft\ SDKs', 'Windows\ Phone','v8.0', 'Tools', 'XapSignTool', 'XapSignTool.exe');
        cmd = "\"" + bin + "\" sign /v " + output,
        defer = Q.defer(),
        options = {
            timeout : 0,
            maxBuffer: 1024 * 400
        },
        child = exec(cmd, options, function (err, stdout, stderr) {
            if(err) {
                defer.reject(cmd + ' ' + err);
                return;
            }
            if(msg.verbose)
                print(stdout.toString());
                print.success('signed %s', product_file_name);
            defer.resolve(msg);
        });

    return defer.promise;
};
