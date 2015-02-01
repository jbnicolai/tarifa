var tarifaFile = require('../../tarifa-file');

module.exports = function (response) {
    return tarifaFile.createFromResponse(response);
};
