var Q = require('q'),
    find = require('findit'),
    rimraf = require('rimraf'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    fs = require('fs'),
    settings = require('../../../../lib/settings'),
    inferJavaClassNameFromProductName = require('../../../../lib/android/infer-classname'),
    libxmljs = require('libxmljs');

module.exports = function (msg) {
    var defer = Q.defer();
    var cwd = process.cwd();
    var conf = msg.localSettings.configurations.android;
    var name = conf[msg.configuration]['product_name'] || conf['default']['product_name'] || conf['name'];
    var id = msg.localSettings.configurations.android[msg.configuration]['id'] || msg.localSettings.id;
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
                var inferedName = inferJavaClassNameFromProductName(name);
                var activity = javaActivityTmpl.replace(/\$PACKAGE_NAME/, id).replace(/\$APP_NAME/, inferedName);
                fs.writeFileSync(path.join(asbPath, inferedName + '.java'), activity);
                var androidManifestXml = libxmljs.parseXml(fs.readFileSync(androidManifestXmlPath));
                androidManifestXml.root().attr('package', id);
                androidManifestXml.get('/manifest/application/activity').attr('android:name', inferedName);
                fs.writeFileSync(androidManifestXmlPath, androidManifestXml.root());
                defer.resolve(msg);
            }
        });
    });
    return defer.promise;
};
