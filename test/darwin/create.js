var should = require('should'),
    fs = require('fs'),
    Q = require('q'),
    path = require('path'),
    tmp = require('tmp'),
    createAction = require('../../actions/create');

describe('tarifa project on darwin', function() {

    it('create a project', function () {

        this.timeout(0);

        var defer = Q.defer(),
            rslt = false,
            mock = path.join(__dirname, '..', 'fixtures', 'create_response_darwin.json'),
            response = JSON.parse(fs.readFileSync(mock, 'utf-8')),
            cwd = process.cwd();

        tmp.dir(function (err, dirPath) {
            if(err) return defer.reject(err);

            // fix mock
            response.path = path.join(dirPath, response.path);
            response.www = path.resolve(__dirname, '..', '..', 'template', 'project');

            process.chdir(dirPath);

            createAction.launchTasks(response).then(function (rslt) {

                rslt.should.equal(response);

                process.chdir(cwd);
                tmp.setGracefulCleanup();
                defer.resolve();
            }, function (err) {
                process.chdir(cwd);
                tmp.setGracefulCleanup();
                defer.reject(err);
            }).done();
        });

        return defer.promise;
    });
});
