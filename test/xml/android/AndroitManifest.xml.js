var should = require('should'),
    path = require('path'),
    fs = require('fs'),
    Q = require('q'),
    tmp = require('tmp'),
    AndroidManifestXml = require('../../../lib/xml/android/AndroidManifest.xml');

describe('[android] replacing stuff in AndroidManifest.xml', function(){
    it('find android:versionCode', function () {
        var file = path.join(__dirname, '../../fixtures/AndroidManifest.xml');
        return AndroidManifestXml.getVersionCode(file).then(function (code) {
            code.should.equal('2');
        });
    });

    it('change versionCode', function () {
        var xml = fs.readFileSync(path.join(__dirname, '../../fixtures/AndroidManifest.xml'), 'utf-8'),
            defer = Q.defer();

        tmp.file(function (err, p, fd) {
            if (err) throw err;
            fs.writeFileSync(p, xml);
            return AndroidManifestXml.setVersionCode(p, '5').then(function () {
                return AndroidManifestXml.getVersionCode(p).then(function (code) {
                    code.should.equal('5');
                    tmp.setGracefulCleanup();
                    defer.resolve();
                }).done();
            });
        });

        return defer.promise;
    });

    it('find activity name', function () {
        var file = path.join(__dirname, '../../fixtures/AndroidManifest.xml');
        return AndroidManifestXml.getActivityName(file).then(function (name) {
            name.should.equal('Ohhhhhh');
        });
    });

    it('change activity name', function () {
        var xml = fs.readFileSync(path.join(__dirname, '../../fixtures/AndroidManifest.xml'), 'utf-8'),
            defer = Q.defer();

        tmp.file(function (err, p, fd) {
            if (err) throw err;
            fs.writeFileSync(p, xml);
            return AndroidManifestXml.setActivityName(p, 'Wrooooooommmm').then(function () {
                return AndroidManifestXml.getActivityName(p).then(function (name) {
                    name.should.equal('Wrooooooommmm');
                    tmp.setGracefulCleanup();
                    defer.resolve();
                }).done();
            });
        });

        return defer.promise;
    });
});
