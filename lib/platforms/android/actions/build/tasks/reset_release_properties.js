var print = require('../../../../../helper/print'),
    releaseProperties = require('../../../lib/release-properties');

module.exports = function (msg) {
    return releaseProperties.remove(process.cwd()).then(function () {
        if(msg.verbose) print.success('release.properties deleted');
        return msg;
    });
};
