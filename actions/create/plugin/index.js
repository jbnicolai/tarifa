var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
    difference = require('interset/difference'),
    intersection = require('interset/intersection'),
    spinner = require('char-spinner'),
    ask = require('../../../lib/questions/ask'),
    PluginBuilder = require('../../../lib/xml/plugin.xml'),
    pathHelper = require('../../../lib/helper/path'),
    print = require('../../../lib/helper/print'),

    questions = [
        'plugin/path',
        'plugin/id',
        'plugin/name',
        'plugin/platforms',
        'plugin/version',
        'plugin/description',
        'plugin/author_name',
        'plugin/keywords',
        'plugin/license'
    ];

function create(verbose) {
    if (verbose) print.banner();
    return ask(questions)({ options: { verbose: verbose } }).then(function (resp) {
        print();
        spinner();
        return launchTasks(resp);
    });
}

function launchTasks(resp) {
    return makeRootDirectory(resp)
        .then(copyPluginXml)
        .then(copyPlatformsFiles);
}

function makeRootDirectory(resp) {
    return fs.isDirectory(resp.path).then(function (exists) {
        return exists ? resp : fs.makeDirectory(resp.path).then(function () {
            return resp;
        });
    });
}

function copyPluginXml(resp) {
    var tmplPath = path.join(__dirname, 'template', 'plugin.xml'),
        destPath = path.join(resp.path, 'plugin.xml');
    return fs.read(tmplPath).then(function (tmplContent) {
        var destContent = tmplContent.replace(/\$ID/g, resp.id)
                                     .replace(/\$TARGET_DIR/g, resp.id.replace('.', '/'))
                                     .replace(/\$NAME/g, resp.name)
                                     .replace(/\$VERSION/g, resp.version)
                                     .replace(/\$DESCRIPTION/g, resp.description)
                                     .replace(/\$AUTHOR_NAME/g, resp.author_name)
                                     .replace(/\$KEYWORDS/g, resp.keywords)
                                     .replace(/\$LICENSE/g, resp.license);
        return fs.write(destPath, destContent);
    }).then(function () {
        var platformsToRemove = difference(Object.keys(platformToFiles), resp.platforms.concat('www'));
        return PluginBuilder.removePlatforms(destPath, platformsToRemove);
    }).then(function () { return resp; });
}

function copyPlatformsFiles(resp) {
    var platformsToCopy = intersection(Object.keys(platformToFiles), resp.platforms.concat('www')),
        filesToCopy = Array.prototype.concat.apply([], platformsToCopy.map(function (platform) {
            return platformToFiles[platform];
        }));
    return filesToCopy.reduce(function (promise, srcPath) {
        return promise.then(function () {
            var tmplPath = path.join(__dirname, 'template', srcPath);
            return fs.read(tmplPath).then(function (tmplContent) {
                var destPath = path.join(resp.path, srcPath.replace(/\$NAME/g, resp.name)),
                    destContent = tmplContent.replace(/\$ID/g, resp.id)
                                             .replace(/\$NAME/g, resp.name);
                return fs.makeTree(path.dirname(destPath)).then(function () {
                    return fs.write(destPath, destContent);
                });
            });
        });
    }, Q.resolve()).then(function () { return resp; });
}

var platformToFiles = {
    android: [ path.join('src', 'android', '$NAME.java') ],
    browser: [ path.join('src', 'browser', '$NAME.js') ],
    ios: [ path.join('src', 'ios', '$NAME.h'), path.join('src', 'ios', '$NAME.m') ],
    wp8: [ path.join('src', 'wp', '$NAME.cs') ],
    www: [ path.join('www', '$NAME.js') ]
};

create.launchTasks = launchTasks;
module.exports = create;
