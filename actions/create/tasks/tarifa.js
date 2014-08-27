var Q = require('q'),
    fs = require('q-io/fs'),
    exec = require('child_process').exec,
    path = require('path'),
    print = require('../../../lib/helper/print'),
    tarifaFile = require('../../../lib/tarifa-file'),
    settings = require('../../../lib/settings'),
    builder = require('../../../lib/builder');

function makeRootDirectory(response) {
    return fs.makeDirectory(response.path).then(function () { return response });
};

function copyWWWProject(response) {
    return fs
        // create tarifa web app folder
        .makeDirectory(path.join(response.path, settings.webAppPath))
        // copy template project to web app folder
        .then(function () {
            var src = path.join(__dirname, '../../../template/project'),
                dest = path.join(response.path, settings.webAppPath);
            return fs.copyTree(src, dest);
        })
        .then(function () {
            if (response.options.verbose)
                print.success('copied template www project');
            return response;
        });
};

function initBuilder(response) {
    return builder.init(response.path, response.options.verbose).then(function () {
        return response;
    }).fail(function (error) {
        print('Try to run tarifa check when your environment is properly configured.');
        return response;
    });
};

function log(response) {
    if (response.options.verbose)
        print.success('project folders created %s', response.path);
    return Q.resolve(response);
};

module.exports = function (response) {
    return makeRootDirectory(response)
        .then(copyWWWProject)
        .then(initBuilder)
        .then(tarifaFile.createFromResponse)
        .then(log);
};
