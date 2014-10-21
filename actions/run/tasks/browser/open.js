var Q = require('q'),
    opener = require('opener'),
    path = require('path'),
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings');

module.exports = function (conf) {
    if(conf.verbose) print.success('trying to open in browser');
    opener(path.join(conf.localSettings.project_output, 'index.html'));
    return Q.resolve(conf);
};
