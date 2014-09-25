var should = require('should'),
    path = require('path'),
    fs = require('fs'),
    Q = require('q'),
    tmp = require('tmp'),
    BuildAppxmanifest = require('../../../lib/xml/windows8/package.appxmanifest');

describe('[windows8] read/write package.appxmanifest', function() {

    it('get id, app label, publisher and description', function () {
        var file = path.join(__dirname, '../../fixtures/package.appxmanifest');
        return BuildAppxmanifest.get(file).then(function (result) {
            result.id.should.equal('org.tarifa.demo');
            result.name.should.equal('demo dev');
            result.publisher.should.equal('CN=$username$');
            result.description.should.equal('toto');
        });
    });

    it('change id, app label, publisher and description', function () {
        var xml = fs.readFileSync(path.join(__dirname, '../../fixtures/package.appxmanifest'), 'utf-8'),
            defer = Q.defer();

        tmp.file(function (err, p, fd) {
            if (err) throw err;
            fs.writeFileSync(p, xml);
            return BuildAppxmanifest.set(p, 'com.toto.tata', 'test', 'peutetre', 'this is a test').then(function () {
                return BuildAppxmanifest.get(p).then(function (result) {
                    result.id.should.equal('com.toto.tata');
                    result.name.should.equal('test');
                    result.publisher.should.equal('peutetre');
                    result.description.should.equal('this is a test');
                    tmp.setGracefulCleanup();
                    defer.resolve();
                }).done();
            });
        });

        return defer.promise;
    });
});
