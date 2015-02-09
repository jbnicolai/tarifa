var path = require('path'),
    pathHelper = require('../../../../helper/path');

module.exports.apk_output_folder = function () {
    return path.join(pathHelper.app(), 'platforms', 'android', 'build', 'outputs', 'apk');
};
