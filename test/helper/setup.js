var path = require('path'),
    fs = require('fs'),
    createAction = require('../../actions/create');

module.exports = function (tmp, projectDefer, responseMockPath) {

    var mock = path.join(__dirname, '..', 'fixtures', responseMockPath),
        response = JSON.parse(fs.readFileSync(mock, 'utf-8'))

    return function createTarifaProject() {
        tmp.dir({ template: path.resolve(__dirname, '..', 'tmp', 'tarifa-XXXXXX') }, function (err, dirPath) {

            if(err) return projectDefer.reject(err);
            response.path = path.join(dirPath, response.path);
            response.www = path.resolve(__dirname, '..', '..', 'template', 'project');

            process.chdir(dirPath);
            createAction.launchTasks(response).then(function (rslt) {
                process.chdir('re');
                projectDefer.resolve({ dirPath: dirPath, rslt: rslt });
            }, function (err) {
                projectDefer.reject(err);
            }).done();
        });
    }
};
