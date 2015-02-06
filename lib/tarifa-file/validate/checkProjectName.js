var path = require('path'),
    settings = require('../../settings');

module.exports = function (root, platform) {
    if (platform) {
        var mod = path.resolve(__dirname, '../../platforms', platform, 'lib/tarifa-file/checkProjectName');
        return function (obj) {
            return require(mod)(path.join(root, settings.cordovaAppPath), obj);
        };
    }
    return function (o) { return o; };
};
