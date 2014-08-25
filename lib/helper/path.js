var path = require('path');
var settings = require('../settings');

var app = module.exports.app = function () {
    return path.join(process.cwd(), settings.cordovaAppPath);
};

var platforms = module.exports.platforms = function () {
    return path.join(app(), 'platforms');
};

module.exports.productFile = function (platform, productFileName, mode) {
    var res;
    switch (platform) {
        case 'android':
            mode = mode ? '-release.apk' : '-debug.apk';
            productFileName = productFileName + mode;
            res = path.join(platforms(), platform, 'ant-build', productFileName);
            break;
        case 'ios':
            productFileName = productFileName.replace(/ /g, '\\ ') + '.ipa';
            res = path.join(platforms(), 'ios/build', productFileName);
            break;
        default:
            throw new Error('Platform not supported or unknown');

    }
    return res;
};
