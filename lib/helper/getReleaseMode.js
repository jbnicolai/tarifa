module.exports = function (platform, config, localSettings) {
    var mode = null,
        localConf = localSettings.configurations[platform][config];

    if (platform === 'android'
            && localConf.keystore_path
            && localConf.keystore_alias) {
        mode = '--release';
    }
    if(platform === 'ios'
            && localConf.apple_developer_identity
            && localConf.provisioning_profile_name) {
        mode = '--release';
    }
    if((platform === 'wp8' || platform === 'windows8') && localConf.release_mode) {
        mode = '--release';
    }
    return mode;
};
