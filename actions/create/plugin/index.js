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
    settings = require('../../../lib/settings'),
    questions = require('../../../lib/questions/list').plugin,

    templates = {
        www: {
            root: path.resolve(__dirname, 'template'),
            files: [ 'www/$NAME.js' ]
        }
    },

    root = path.resolve(__dirname, '../../../');

settings.platforms.forEach(function (platform) {
    templates[platform] = require(path.resolve(
            root,
            'lib/platforms',
            platform,
            'actions/create/plugin'
    ));
});

function create(verbose) {
    if (verbose) print.banner();
    var opts = { options: { verbose: verbose } };
    return ask(questions)(opts).then(function (resp) {
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
        return settings.platforms.reduce(function (xmlP, platform) {
            return Q.when(xmlP, function (xml) {
                var pluginXMLPath = templates[platform].pluginXMLPath;
                return fs.read(pluginXMLPath).then(function (content) {
                    xml += content; return xml;
                });
            });
        }, '').then(function (platformsContent) {
            return tmplContent.replace(/\$PLATFORMS/g, platformsContent);
        });

    }).then(function (tmplContent) {
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
        var platformsToRemove = difference(Object.keys(templates), resp.platforms.concat('www'));
        return PluginBuilder.removePlatforms(destPath, platformsToRemove);
    }).then(function () { return resp; });
}

function copyPlatformsFiles(resp) {
    var platforms = intersection(Object.keys(templates), resp.platforms.concat('www')),
        filesToCopy = Array.prototype.concat.apply([], platforms.map(function (platform) {
            return templates[platform].files.map(function (f) {
                return { src: path.resolve(templates[platform].root, f), dest: f };
            });
        }));
    return filesToCopy.reduce(function (promise, file) {
        return promise.then(function () {
            return fs.read(file.src).then(function (tmplContent) {
                var destPath = path.resolve(resp.path, file.dest.replace(/\$NAME/g, resp.name)),
                    destContent = tmplContent.replace(/\$ID/g, resp.id)
                                             .replace(/\$NAME/g, resp.name);
                return fs.makeTree(path.dirname(destPath)).then(function () {
                    return fs.write(destPath, destContent);
                });
            });
        });
    }, Q()).then(function () { return resp; });
}

create.launchTasks = launchTasks;
module.exports = create;
