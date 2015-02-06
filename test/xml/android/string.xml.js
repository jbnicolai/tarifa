var should = require('should'),
    path = require('path'),
    fs = require('fs'),
    Q = require('q'),
    tmp = require('tmp'),
    stringXml = require('../../../lib/platforms/android/lib/xml/string.xml');

describe('[android] setting app_name in android/res/values/strings.xml', function() {
    it('find app_name', function () {
        var file = path.join(__dirname, '../../fixtures/strings.xml');
        return stringXml.getAppName(file).then(function (app_name) {
            app_name.should.equal('demo prod');
        });
    });

    it('find app_name in strings.xml with multiple strings', function () {
        var file = path.join(__dirname, '../../fixtures/strings3.xml');
        return stringXml.getAppName(file).then(function (app_name) {
            app_name.should.equal('demo prod');
        });
    });

    it('change app_name', function () {
        var xml = fs.readFileSync(path.join(__dirname, '../../fixtures/strings.xml'), 'utf-8'),
            defer = Q.defer();

        tmp.file(function (err, p, fd) {
            if (err) throw err;
            fs.writeFileSync(p, xml);
            return stringXml.changeAppName(p, 'another app name').then(function () {
                return stringXml.getAppName(p).then(function (app_name) {
                    app_name.should.equal('another app name');
                    tmp.setGracefulCleanup();
                    defer.resolve();
                }).done();
            });
        });

        return defer.promise;
    });
});
