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
    var conf = msg.settings.configurations.android;
    var name = conf[msg.config]['name'] || conf['default']['name'] || conf['name'];
    var id = msg.settings.configurations.android[msg.config]['id'] || msg.settings.id;
    var srcPath = path.join(cwd, settings.cordovaAppPath, '/platforms/android/src/');
    var finder = find(path.join(cwd, settings.cordovaAppPath, '/platforms/android/src/'));
    var javaActivityTmpl = fs.readFileSync(path.join(__dirname, 'activity.java.tmpl'), 'utf-8');
    var androidManifestXmlPath = path.join(cwd, settings.cordovaAppPath, 'platforms/android/AndroidManifest.xml');

    // the top level package can not be used for anythings else as the main activity
    var file = path.join(srcPath, id.split('.')[0]);
    var asbPath = path.join(srcPath, id.replace(/\./g, '/'));
    rimraf(file, function (err) {
        if(err) defer.reject("unable to remove file " + file);
        mkdirp(asbPath, function (err) {
            if (err) {
                defer.reject("unable to create package " + asbPath);
            }
            else {
                var activity = javaActivityTmpl.replace(/\$PACKAGE_NAME/, id).replace(/\$APP_NAME/, name);
                fs.writeFileSync(path.join(asbPath, name + '.java'), activity);
                var androidManifestXml = libxmljs.parseXml(fs.readFileSync(androidManifestXmlPath));
                androidManifestXml.root().attr('package', id);
                androidManifestXml.get('/manifest/application/activity').attr('android:name', name);
                fs.writeFileSync(androidManifestXmlPath, androidManifestXml.root());
                defer.resolve(msg);
            }
        });
    });
    return defer.promise;
};
