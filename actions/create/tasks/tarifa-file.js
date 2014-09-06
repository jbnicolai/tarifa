var tarifaFile = require('../../../lib/tarifa-file');

module.exports = function (response) {
    return tarifaFile.createFromResponse(response);
};
