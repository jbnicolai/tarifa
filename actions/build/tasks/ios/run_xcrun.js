var Q = require('q'),
    exec = require('child_process').exec,
    path = require('path'),
    pathHelper = require('../../../../lib/helper/path'),
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var conf = msg.localSettings.configurations.ios[msg.configuration];

    if(!conf['product_file_name'] || !conf['apple_developer_identity']){
        return Q.resolve(msg);
    }

    var product_file_name = conf['product_file_name'] + '.ipa',
        developer_identity = conf['apple_developer_identity'],
        output = path.join(pathHelper.app(), 'platforms', 'ios', 'build', product_file_name),
        provisioning_profile_path = conf['provisioning_profile_path'];

    var defer = Q.defer(),
        app_input = path.join(pathHelper.app(), 'platforms', 'ios', 'build', 'device', conf['product_name'] + '.app'),
        cmd = 'xcrun -log -sdk iphoneos PackageApplication -v "'
            + app_input + '" -o "'
            + output
            + '" -sign "'
            + developer_identity
            + '" -embed "'
            + provisioning_profile_path + '"',
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
                print.success('run xcrun and produced the ipa: %s', output.toString());
            defer.resolve(msg);
        });

    return defer.promise;
};
