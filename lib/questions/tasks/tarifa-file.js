var Q = require('q'),
    tarifaFile = require('../../tarifa-file');

module.exports = function (response) {
    if(response.createProjectFromTarifaFile) return Q(response);
    return tarifaFile.createFromResponse(response);
};
