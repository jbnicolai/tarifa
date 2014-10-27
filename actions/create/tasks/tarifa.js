var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
    format = require('util').format,
    print = require('../../../lib/helper/print'),
    settings = require('../../../lib/settings'),
    pkg = require('../../../package.json'),
    builder = require('../../../lib/builder');

function makeRootDirectory(response) {
    return fs.makeDirectory(response.path)
        .then(function () { return response });
};

function copyWWWProject(response) {
    return fs
        // create tarifa web app folder
        .makeDirectory(path.join(response.path, settings.webAppPath))
        // copy template project to web app folder
        .then(function () {
            var src = response.www,
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

function createDotTarifaFile(response) {
    var o = {
        current: pkg.version,
        created: pkg.version
    };
    return fs.write(path.join(response.path, '.tarifa.json'), JSON.stringify(o, null, 2))
        .then(function () { return response; });
}

function createUserCheckScripts(response) {
    var content = "module.exports = function (msg) {\n    return msg;\n}",
        write = function (platform) {
            return fs.write(path.join(response.path, 'project/bin', format('check_%s.js', platform)), content);
        };
    return Q.all(response.platforms.map(write))
        .then(function () { return response; });
}

module.exports = function (response) {
    return makeRootDirectory(response)
        .then(copyWWWProject)
        .then(initBuilder)
        .then(createDotTarifaFile)
        .then(createUserCheckScripts)
        .then(log);
};
