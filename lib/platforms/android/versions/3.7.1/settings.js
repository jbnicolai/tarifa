var path = require('path'),
    pathHelper = require('../../../../helper/path');

module.exports.apk_output_folder = function () {
    return path.join(pathHelper.app(), 'platforms', 'android', 'build', 'outputs', 'apk');
};

module.exports.beforeCompile = function (conf, options) {
    process.env.ANDROID_BUILD = 'gradle';
    options.push('--gradle');
    options.push('--gradleArg=-PcdvReleaseSigningPropertiesFile=release.properties');
    return options;
};

module.exports.signingTemplate = "storeFile=%s\nkeyAlias=%s\nstorePassword=%s\nkeyPassword=%s";
