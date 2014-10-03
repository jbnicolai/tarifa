var path = require('path');
var settings = require('../settings');

var root = module.exports.root = function () {
    return process.cwd();
};

var app = module.exports.app = function () {
    return path.join(root(), settings.cordovaAppPath);
};

var platforms = module.exports.platforms = function () {
    return path.join(app(), 'platforms');
};

module.exports.productFile = function (platform, productFileName, mode) {
    var res;
    switch (platform) {
        case 'android':
            res = path.join(platforms(), platform, productFileName + '.apk');
            break;
        case 'ios':
            productFileName = productFileName.replace(/ /g, '\\ ') + '.ipa';
            res = path.join(platforms(), 'ios/build', productFileName);
            break;
        case 'wp8':
            productFileName = productFileName + '.xap';
            res = path.join(platforms(), 'wp8', 'Bin', 'Release', productFileName);
            break;
        default:
            throw new Error('Platform not supported or unknown');

    }
    return res;
};
