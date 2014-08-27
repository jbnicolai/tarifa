var Q = require('q'),
    fs = require('q-io/fs'),
    exec = require('child_process').exec,
    path = require('path'),
    settings = require('./settings'),
    print = require('./helper/print');

module.exports.init = function (root, verbose) {
    var cwd = process.cwd(),
        wwwPath = path.join(root, settings.webAppPath);

    process.chdir(wwwPath);
    return fs.exists('node_modules').then(function (exists) {
        var rmv = exists ? fs.removeTree('node_modules') : Q.resolve(),
            inst = function () {
                var d = Q.defer(),
                    opts = {
                        timeout: 30 * 1000,
                        cwd: null,
                        env: null
                    };
                exec('npm install', opts, function (error, stdout, stderr) {
                    if(error) {
                        d.reject(error);
                        var expl = 'You may have a problem with your network connectivity.';
                        print.error('npm install error in %s, reason:\n%s%s', wwwPath, error, expl);
                        return;
                    }
                    if(verbose) print.success('npm install www project');
                    d.resolve();
                });
                return d.promise;
            };
        return rmv.then(inst).then(function () {
            process.chdir(cwd);
        }, function (error) {
            process.chdir(cwd);
            throw error;
        });
    });
};

module.exports.build = function (platform, localSettings, configuration, verbose) {
    var wwwBuild = require(path.join(process.cwd(), settings.build));
    return wwwBuild(platform, localSettings, configuration).then(function () {
        if(verbose) print.success('www project build done with configuration %s', configuration);
    });
};
