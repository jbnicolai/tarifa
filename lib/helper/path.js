var path = require('path');

module.exports.current = function () {
    return path.join(process.cwd(), 'tarifa.json');
};
