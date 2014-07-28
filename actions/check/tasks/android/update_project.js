var Q = require('q'),
    chalk = require('chalk'),
    settings = require('../../../../lib/settings'),
    exec = require('child_process').exec,
    path = require('path');

module.exports = function (msg) {
    var manifestPath = path.join(process.cwd(), settings.cordovaAppPath, 'platforms', 'android'),
        cmd = "android update project -p " + manifestPath + " --subprojects",
        options = {
            timeout : 0,
            maxBuffer: 1024 * 400
        },
        defer = Q.defer();

    var child = exec(cmd, options, function (err, stdout, stderr) {
        if(err) {
            if(msg.verbose) {
                console.log(chalk.red('command: ' + cmd));
                console.log('android stderr ' + stderr);
            }
            defer.reject('android ' + err);
            return;
        }
        console.log(chalk.green('✔') + ' updated android project!');
        defer.resolve(msg);
    });
    if (msg.verbose) {
        child.stdout.pipe(process.stderr);
    }
    return defer.promise;
};
