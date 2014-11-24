var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
    print = require('../../../lib/helper/print'),
    pathHelper = require('../../../lib/helper/path'),
    settings = require('../../../lib/settings');

function createGitIgnoreFiles(response) {
    var gitIgnoreBuilders = [
        {
            src: path.join(__dirname, 'gitignore-root.txt'),
            destdir: pathHelper.resolve(response.path),
            content: settings.privateTarifaFileName
        },
        {
            src: path.join(__dirname, 'gitignore-app.txt'),
            destdir: pathHelper.resolve(response.path, settings.cordovaAppPath)
        }
    ];
    var promises = gitIgnoreBuilders.map(function (builder) {
        var create = function () {
            var dest = path.join(builder.destdir, '.gitignore'),
                p = Q.resolve();
            if (builder.src) p = p.then(function () { return fs.copy(builder.src, dest); });
            if (builder.content) p = p.then(function () { return fs.append(dest, builder.content); });
            return p;
        };
        return fs.isDirectory(builder.destdir).then(function (exists) {
            return exists ? create() : Q.resolve();
        });
    });
    return Q.all(promises).then(function () {
        if (response.options.verbose)
            print.success('created .gitignore files');
        return response;
    });
};

function createGitKeepFiles(response) {
    var dest = pathHelper.resolve(response.path, settings.cordovaAppPath, 'platforms/android/assets/.gitkeep'),
        dirname = path.dirname(dest),
        content = '',
        create = function () {
            return fs.write(dest, content).then(function () {
                if (response.options.verbose)
                    print.success('created .gitkeep files');
                return response;
            });
        };
    return fs.isDirectory(dirname).then(function (exists) {
        return exists ? create() : response;
    });
};

module.exports = function (response) {
    return createGitIgnoreFiles(response).then(createGitKeepFiles);
};
