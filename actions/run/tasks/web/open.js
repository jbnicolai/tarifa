var Q = require('q'),
    opener = require('opener'),
    path = require('path'),
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings');

module.exports = function (localSettings, config, verbose) {
    if(verbose) print.success('trying to open in browser');
    opener(path.join(settings.project_output, 'index.html'));
    return Q.resolve();
};
