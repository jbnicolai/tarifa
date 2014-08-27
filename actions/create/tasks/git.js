var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
    print = require('../../../lib/helper/print'),
    settings = require('../../../lib/settings');

function createGitIgnoreFiles(response) {
    var gitIgnoreBuilders = [
        {
            destdir: response.path,
            content: settings.privateTarifaFileName
        },
        {
            src: path.join(__dirname, 'gitignore-app.txt'),
            destdir: path.join(response.path, settings.cordovaAppPath)
        }
    ];
    var promises = gitIgnoreBuilders.map(function (builder) {
        var dest = path.join(builder.destdir, '.gitignore'),
            p = Q.resolve();
        if (builder.src) p = p.then(function () { return fs.copy(builder.src, dest); });
        if (builder.content) p = p.then(function () { return fs.append(dest, builder.content); });
        return p;
    });
    return Q.all(promises).then(function () {
        if (response.options.verbose)
            print.success('created .gitignore files');
        return response;
    });
};

function createGitKeepFiles(response) {
    var dest = path.join(response.path, settings.cordovaAppPath, 'platforms/android/assets/.gitkeep'),
        content = '';
    return fs.write(dest, content).then(function () {
        if (response.options.verbose)
            print.success('created .gitkeep files');
        return response;
    });
};

module.exports = function (response) {
    return createGitIgnoreFiles(response).then(createGitKeepFiles);
};
