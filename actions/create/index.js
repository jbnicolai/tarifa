var Q = require('q'),
    inquirer = require('inquirer'),
    cordova = require('cordova'),
    fs = require('fs'),
    path = require('path'),
    argsHelper = require('../../lib/args'),

    questions = [
        require('./questions/path'),
        require('./questions/id'),
        require('./questions/name'),
        require('./questions/description'),
        require('./questions/platforms'),
        require('./questions/plugins'),
    ],

    verbose = false;

function create(argv) {

    if(argsHelper.matchSingleOptions(argv, 'h', 'help')) {
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        return Q.resolve();
    }

    if(argv.V == true || argv.verbose == true) verbose = true;

    var defer = Q.defer();

    inquirer.prompt(questions, function(resp) {
        var cfg = { };
        cordova.create(resp.project_path, resp.project_id, resp.project_name, cfg, function (err) {
            if(err) {
                defer.reject(err);
                return;
            }
            defer.resolve();
        });
    });

    return defer.promise;
};

module.exports = create;
