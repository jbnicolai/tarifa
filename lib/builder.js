var Q = require('q'),
    fs = require('q-io/fs'),
    exec = require('child_process').exec,
    path = require('path'),
    settings = require('./settings'),
    print = require('./helper/print');

module.exports.init = function (root, verbose) {
    var wwwPath = path.join(root, settings.webAppPath),
        nodeModulesPath = path.join(wwwPath, 'node_modules');
    return fs.exists(nodeModulesPath).then(function (exists) {
        var inst = function () {
            var d = Q.defer(),
                cwd = process.cwd(),
                opts = {
                    timeout: 30 * 1000,
                    cwd: null,
                    env: null
                };
            process.chdir(wwwPath);
            exec('npm install', opts, function (error, stdout, stderr) {
                process.chdir(cwd);
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
        return exists ? Q.resolve() : inst();
    });
};

module.exports.build = function (platform, localSettings, configuration, verbose) {
    var wwwBuild = require(path.join(process.cwd(), settings.build)).build;
    return wwwBuild(platform, localSettings, configuration).then(function () {
        if(verbose) print.success('www project build done with configuration %s', configuration);
    });
};
