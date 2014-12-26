var Q = require('q'),
    exec = require('child_process').exec,
    path = require('path'),
    format = require('util').format,
    pathHelper = require('../../../../lib/helper/path'),
    print = require('../../../../lib/helper/print'),
    askPassword = require('../../../../lib/helper/question').password,
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var conf = msg.localSettings.configurations.wp8[msg.configuration],
        release_mode = conf['release_mode'],
        certificate_path = conf['certificate_path'];

    if(!release_mode || !certificate_path) return Q.resolve(msg);

    var product_file_name = conf['product_file_name'] + '.xap',
        output = path.join(pathHelper.app(), 'platforms', 'wp8', 'bin', 'Release', product_file_name),
        bin = settings.external.xapsigntool.name,
        defer = Q.defer(),
        options = {
            timeout : 0,
            maxBuffer: 1024 * 400
        },
        passwordPromise = msg.wp8_certif_password
            ? Q(msg.wp8_certif_password)
            : askPassword('What is the password of your certificate?');

    passwordPromise.then(function (password) {
        var cmd = format("\"%s\" sign /v /f %s /p %s %s", bin, certificate_path, password, output);
        exec(cmd, options, function (err, stdout, stderr) {
            if(err) {
                defer.reject(cmd + ' ' + err);
                return;
            }
            if(msg.verbose){
                print(stdout.toString());
                print.success('signed %s', product_file_name);
            }
            defer.resolve(msg);
        });
    });
    return defer.promise;
};
