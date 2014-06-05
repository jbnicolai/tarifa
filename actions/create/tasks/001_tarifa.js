var Q = require('q'),
    fs = require('fs'),
    chalk = require('chalk');

module.exports = function (response) {
    // create project folder
    fs.mkdirSync(response.project_path);
    if (response.verbose) console.log('\n' + chalk.green('✔') + ' project folder created ' + response.project_path);
    // TODO 2 create project main structure
    // TODO 3 create the tarifa project file tarifa.json and the package.json
    return Q.resolve(response);
};
