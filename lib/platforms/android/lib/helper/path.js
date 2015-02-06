var path = require('path');

module.exports.wwwFinalLocation = function wwwFinalLocation(root) {
    return path.join(root,'platforms/android/assets/www');
};

module.exports.productFile = function productFile(platformsRoot, platform, productFileName) {
    return path.join(platformsRoot(), platform, productFileName + '.apk');
};
