var Q = require('q'),
    chalk = require('chalk');

module.exports = function (msg) {
    var product_name = msg.settings.configurations.android[msg.config]['product_file_name'];
    // TODO swap the project name in the build.xml of the android project
    if(msg.verbose)
        console.log(chalk.green('✔') + ' change product_file_name to ' + product_name);
    return Q.resolve(msg);
};
