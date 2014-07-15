var Q = require('q'),
    exec = require('child_process').exec,
    chalk = require('chalk'),
    path = require('path'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var conf = msg.settings.configurations.ios[msg.config];

    if(!conf['product_file_name'] || !conf['apple_developer_identity']){
        return Q.resolve(msg);
    }

    var product_file_name = conf['product_file_name'] + '.ipa',
        developer_identity = conf['apple_developer_identity'],
        output = path.join(process.cwd(), settings.output_folder, product_file_name),
        provisioning_profile = conf['provisioning_profile'];

    var defer = Q.defer(),
        app_output = path.join('app/platforms/ios/build/device', conf['product_file_name'] + '.app'),
        cmd = 'xcrun -log -sdk iphoneos PackageApplication -v "'
            + app_output + '" -o "'
            + output
            + '" -sign "'
            + developer_identity
            + '" -embed "'
            + provisioning_profile + '"',
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
                console.log(stdout.toString());
                console.log(chalk.green('✔') + '  run xcrun and produced the ipa: ' + output.toString());
            defer.resolve(msg);
        });

    return defer.promise;
};
