/*
 * build.js
 */

var browserify = require('browserify'),
    Q = require('q'),
    preprocess = require('preprocess'),
    path = require('path'),
    fs = require('fs'),
    tmp = require('tmp');

function mapSettings(settings, platform, configurationName) {
    var mapping = require('./mapping');
    var result = {};
    var flatSettings = {};

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

module.exports = function build(platform, settings, configurationName, verbose) {
    var b = browserify();
    var defer = Q.defer();
    var output = path.join(__dirname, '../www/main.js');

    if(fs.existsSync(output)) fs.unlinkSync(output);

    var ws = fs.createWriteStream(path.join(__dirname, '../www/main.js'));

    tmp.file({ prefix: 'settings-', postfix: '.json' },function (err, tmpFilePath) {
        if (err) defer.reject(err);
        fs.writeFileSync(tmpFilePath, JSON.stringify(mapSettings(settings, platform, configurationName), null, 2));
        b.add(path.join(__dirname, '../src/app.js'))
            .require(tmpFilePath, { expose : 'settings' })
            .bundle()
            .pipe(ws);

        ws.on('finish', function() {
            tmp.setGracefulCleanup();
            var htmlSrc = path.join(__dirname, '../html/index.html');
            var htmlDest = path.join(__dirname, '../www/index.html');
            preprocess.preprocessFileSync(htmlSrc, htmlDest, {
                PLATFORM : platform
            });

            if(verbose)
                console.log('✔ www project build done with configuration ' + configurationName + '!');
            defer.resolve();
        });
    });
    return defer.promise;
};
