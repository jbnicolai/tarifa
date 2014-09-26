var should = require('should'),
    path = require('path'),
    fs = require('fs'),
    Q = require('q'),
    tmp = require('tmp'),
    BuildXml = require('../../../lib/xml/android/build.xml');

describe('[android] setting name attribute in android/build.xml', function() {

    it('find name', function () {
        var file = path.join(__dirname, '../../fixtures/build.xml');
        return BuildXml.getName(file).then(function (name) {
            name.should.equal('Hello');
        });
    });

    it('change name', function () {
        var xml = fs.readFileSync(path.join(__dirname, '../../fixtures/build.xml'), 'utf-8'),
            defer = Q.defer();

        tmp.file(function (err, p, fd) {
            if (err) throw err;
            fs.writeFileSync(p, xml);
            return BuildXml.changeName(p, 'Ooops').then(function () {
                return BuildXml.getName(p).then(function (name) {
                    name.should.equal('Ooops');
                    tmp.setGracefulCleanup();
                    defer.resolve();
                }).done();
            });
        });

        return defer.promise;
    });
});
