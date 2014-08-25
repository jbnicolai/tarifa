var Q = require('q'),
    fs = require('fs'),
    exec = require('child_process').exec,
    path = require('path'),
    ncp = require('ncp').ncp,
    print = require('../../../lib/helper/print'),
    tarifaFile = require('../../../lib/tarifa-file'),
    settings = require('../../../lib/settings'),
    builder = require('../../../lib/builder');

function log(response) {
    if (response.options.verbose)
        print.success('project folders created %s', response.path);
    return Q.resolve(response);
}

function copyWWWProject(response) {
    // create tarifa web app folder
    fs.mkdirSync(path.join(response.path, settings.webAppPath));

    // copy template project to web app folder
    ncp.limit = 42;
    var source = path.join(__dirname, '../../../template/project');
    var destination = path.join(response.path, settings.webAppPath);
    var defer = Q.defer();

    ncp(source, destination, function (err) {
        if (err) return defer.reject(err);
        if (response.options.verbose)
            print.success('copied template www project');
        defer.resolve(response);
    });

    return defer.promise;
}

function initBuilder(response) {
    return builder.init(response.path, response.options.verbose).then(function () {
        return response;
    }).fail(function (error) {
        print('Try to run tarifa check when your environment is properly configured.');
        return response;
    });
}

function createGitIgnore (response) {
    var d = Q.defer(),
        f = path.join(response.path, '.gitignore'),
        buf = settings.privateTarifaFileName + '\n';
    fs.writeFile(f, buf, function (err) {
        if(err) return d.reject(err);
        if(response.options.verbose) print.success('created .gitignore');
        d.resolve(response);
    });
    return d.promise;
};

module.exports = function (response) {
    if(!fs.existsSync(response.path)) fs.mkdirSync(response.path);
    return copyWWWProject(response)
        .then(initBuilder)
        .then(createGitIgnore)
        .then(tarifaFile.createFromResponse)
        .then(log);
};
