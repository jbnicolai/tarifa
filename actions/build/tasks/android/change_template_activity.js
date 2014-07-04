var Q = require('q'),
    find = require('findit'),
    rimraf = require('rimraf'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    fs = require('fs'),
    settings = require('../../../../lib/settings'),
    libxmljs = require('libxmljs');

module.exports = function (msg) {
    var defer = Q.defer();
    var cwd = process.cwd();
    var name = msg.settings.configurations.android[msg.config]['name'];
    var id = msg.settings.configurations.android[msg.config]['id'] || msg.settings.id;
    var srcPath = path.join(cwd, settings.cordovaAppPath, '/platforms/android/src/');
    var finder = find(path.join(cwd, settings.cordovaAppPath, '/platforms/android/src/'));
    var javaActivityTmpl = fs.readFileSync(path.join(__dirname, 'activity.java.tmpl'), 'utf-8');
    var androidManifestXmlPath = path.join(cwd, settings.cordovaAppPath, 'platforms/android/AndroidManifest.xml');

    finder.on('file', function (file, stat) {
        if(path.basename(file) == (name + '.java')) {
            rimraf(file, function (err) {
                if(err) defer.reject("unable to remove file " + file);
            });
        }
    });

    finder.on('end', function (file, stat) {
        var asbPath = path.join(srcPath, id.replace(/\./g, '/'));
        mkdirp(asbPath, function (err) {
            if (err) {
                defer.reject("unable to create package " + asbPath);
            }
            else {
                var activity = javaActivityTmpl.replace(/\$PACKAGE_NAME/, id).replace(/\$APP_NAME/, name);
                fs.writeFileSync(path.join(asbPath, name + '.java'), activity);
                var androidManifestXml = libxmljs.parseXml(fs.readFileSync(androidManifestXmlPath));
                fs.writeFileSync(androidManifestXmlPath, androidManifestXml.root().attr('package', id));
                defer.resolve(msg);
            }
        });
    });
    return defer.promise;
};
