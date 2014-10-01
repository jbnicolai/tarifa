var tarifaFile = require('../../../lib/tarifa-file');

module.exports = function (response) {

    // adding org.apache.cordova.splashscreen as a default plugin
    response.plugins.push('org.apache.cordova.splashscreen');

    return tarifaFile.createFromResponse(response);
};
