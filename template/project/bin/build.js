/*
 * build.js
 */

var browserify = require('browserify'),
    watchify = require('watchify'),
    Q = require('q'),
    path = require('path'),
    fs = require('fs'),
    chokidar = require('chokidar'),

    w, // watchify instance
    watcher // chokidar watcher instance;

function mapSettings(settings, platform, configurationName) {
    var mapping = require('./mapping'),
        result = {},
        flatSettings = {};

    for (var k in settings) {
        if (k !== "configurations") {
            flatSettings[k] = settings[k];
        } else {
            for (var l in settings[k][platform][configurationName]) {
                flatSettings[l] = settings[k][platform][configurationName][l];
            }
        }
    }

    for (var j in flatSettings) {
        if (mapping[j] !== undefined) {
            result[mapping[j]] = flatSettings[j];
        }
    }

    return result;
}

function runBrowserify(input, output, settings, platform, configurationName) {
    var defer = Q.defer(),
        settingsJSONFile = path.join(__dirname, 'settings.json'),
        b = browserify(),
        jsonSettings = JSON.stringify(mapSettings(settings, platform, configurationName));

    if(fs.existsSync(settingsJSONFile)) fs.unlinkSync(settingsJSONFile);
    if(fs.existsSync(output)) fs.unlinkSync(output);

    fs.writeFileSync(settingsJSONFile, jsonSettings, null, 2);

    var ws = fs.createWriteStream(output);

    b.add(input)
        .on('error', function (err) { defer.reject(err); })
        .require(settingsJSONFile, { expose : 'settings' })
        .bundle()
        .pipe(ws);

    ws.on('finish', function() { defer.resolve(); });

    return defer.promise;
}

function runWatchify(input, output, settings, platform, configurationName, f) {
    var settingsJSONFile = path.join(__dirname, 'settings.json'),
        b = browserify({ cache: {}, packageCache: {}, fullPaths: false}),
        jsonSettings = JSON.stringify(mapSettings(settings, platform, configurationName));

    if(fs.existsSync(settingsJSONFile)) fs.unlinkSync(settingsJSONFile);
    if(fs.existsSync(output)) fs.unlinkSync(output);

    fs.writeFileSync(settingsJSONFile, jsonSettings, null, 2);

    var ws = fs.createWriteStream(output);

    b.add(input)
        .on('error', function (err) { console.log(err); })
        .require(settingsJSONFile, { expose : 'settings' })
        .bundle()
        .pipe(ws);

    var w = watchify(b);

    w.on('update', function () {
        w.bundle().pipe(fs.createWriteStream(output));
    });

    w.on('error', function (err) {
        console.log(err);
    });

    w.on('log', function (msg) { console.log('[browserify] ' + msg); })
}

module.exports.build = function build(platform, settings, configurationName) {

    var jsSrc = path.join(__dirname, '../src/app.js'),
        jsDest = path.join(__dirname, '..', '..', settings.project_output, 'main.js');

    return runBrowserify(jsSrc, jsDest, settings, platform, configurationName);
};

module.exports.watch = function watch(f, settings, platform, configurationName) {

    var jsSrc = path.join(__dirname, '../src/app.js'),
        jsDest = path.join(__dirname, '..', '..', settings.project_output, 'main.js');

    w = runWatchify(jsSrc, jsDest, settings, platform, configurationName, f);

    watcher = chokidar.watch(
        path.join(__dirname, '..', '..', settings.project_output),
        { ignored: /[\/\\]\./, persistent: true }
    );

    setTimeout(function () {
        watcher.on('all', function (evt, p) { f(p); });
    }, 4000);
};

module.exports.close = function () {
    if(w) w.close();
    if(watcher) watcher.close();
};
