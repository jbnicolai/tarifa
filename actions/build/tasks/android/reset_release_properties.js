var print = require('../../../../lib/helper/print'),
    releaseProperties = require('../../../../lib/android/release-properties');

module.exports = function (msg) {
    return releaseProperties.remove(process.cwd()).then(function () {
        if(msg.verbose) print.success('release.properties deleted');
        return msg;
    });
};
