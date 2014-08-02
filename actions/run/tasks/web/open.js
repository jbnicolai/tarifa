var Q = require('q'),
    opener = require('opener'),
    chalk = require('chalk'),
    path = require('path'),
    settings = require('../../../../lib/settings');

module.exports = function (localSettings, config, verbose) {
    if(verbose) console.log(chalk.green('✔') + ' trying to open in browser');
    opener(path.join(settings.project_output, 'index.html'));
    return Q.resolve();
};
