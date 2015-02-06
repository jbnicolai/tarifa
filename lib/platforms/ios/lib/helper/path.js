var path = require('path');

module.exports.wwwFinalLocation = function wwwFinalLocation(root) {
    return path.join(root,'platforms/ios/www');
};

module.exports.productFile = function productFile(platformsRoot, platform, productFileName) {
    return path.join(platformsRoot, 'ios/build', productFileName.replace(/ /g, '\\ ') + '.ipa');
};
