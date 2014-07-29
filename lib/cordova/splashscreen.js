var copyDefaultAssets = require('./assets').copyDefaultAssets,
    copyAssets = require('./assets').copyAssets,
    rawGenerate = require('./assets').generate,

    mapping = {
        ios : [
            { src: 'screen-640x1136.png',   dest: '{$app_name}/Resources/splash/Default-568h@2x~iphone.png' },
            { src: 'screen-2048x1496.png',  dest: '{$app_name}/Resources/splash/Default-Landscape@2x~ipad.png' },
            { src: 'screen-1024x748.png',   dest: '{$app_name}/Resources/splash/Default-Landscape~ipad.png' },
            { src: 'screen-1536x2008.png',  dest: '{$app_name}/Resources/splash/Default-Portrait@2x~ipad.png' },
            { src: 'screen-768x1004.png',   dest: '{$app_name}/Resources/splash/Default-Portrait~ipad.png' },
            { src: 'screen-640x960.png',    dest: '{$app_name}/Resources/splash/Default@2x~iphone.png' },
            { src: 'screen-320x480.png',    dest: '{$app_name}/Resources/splash/Default~iphone.png' }
        ],
        android : [
            { src: 'screen-640x480.png',    dest: 'res/drawable-land-hdpi/screen.png' },
            { src: 'screen-426x320.png',    dest: 'res/drawable-land-ldpi/screen.png' },
            { src: 'screen-470x320.png',    dest: 'res/drawable-land-mdpi/screen.png' },
            { src: 'screen-960x720.png',    dest: 'res/drawable-land-xhdpi/screen.png' },
            { src: 'screen-1410x960.png',   dest: 'res/drawable-land-xxhdpi/screen.png' },
            { src: 'screen-1880x1280.png',  dest: 'res/drawable-land-xxxhdpi/screen.png' },
            { src: 'screen-480x640.png',    dest: 'res/drawable-port-hdpi/screen.png' },
            { src: 'screen-320x426.png',    dest: 'res/drawable-port-ldpi/screen.png' },
            { src: 'screen-320x470.png',    dest: 'res/drawable-port-mdpi/screen.png' },
            { src: 'screen-720x960.png',    dest: 'res/drawable-port-xhdpi/screen.png' },
            { src: 'screen-960x1410.png',   dest: 'res/drawable-port-xxhdpi/screen.png' },
            { src: 'screen-1280x1880.png',  dest: 'res/drawable-port-xxxhdpi/screen.png' }
        ],
        wp8 : []
    };

module.exports.copyDefault = function copyDefault(root, platforms, verbose) {
    return copyDefaultAssets(mapping, root, platforms, 'splashscreens', verbose);
};

module.exports.copySplashscreens = function copySplashscreens(platform, configuration) {
    return copyAssets(mapping, platform, configuration, 'splashscreens');
};

module.exports.generate = function generate(color, root, platforms, config, verbose) {
    var nativePlatforms = platforms.filter(function (platform) {
        return platform !== 'web';
    });
    return rawGenerate(mapping, color, 'splashscreens', root, nativePlatforms, config, verbose);
};
