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
            { src: 'screen-320x480.png',    dest: '{$app_name}/Resources/splash/Default~iphone.png' },
            { src: 'screen-750x1334.png',   dest: '{$app_name}/Resources/splash/Default-667h.png' },
            { src: 'screen-1242x2208.png',  dest: '{$app_name}/Resources/splash/Default-736h.png' },
            { src: 'screen-2208x1242.png',  dest: '{$app_name}/Resources/splash/Default-Landscape-736h.png' }
        ],
        android : [
            { src: ['screen-640x480.9.png', 'screen-640x480.png'],   dest: ['res/drawable-land-hdpi/screen.9.png', 'res/drawable-land-hdpi/screen.png'] },
            { src: ['screen-426x320.9.png', 'screen-426x320.png'],   dest: ['res/drawable-land-ldpi/screen.9.png', 'res/drawable-land-ldpi/screen.png'] },
            { src: ['screen-470x320.9.png', 'screen-470x320.png'],   dest: ['res/drawable-land-mdpi/screen.9.png', 'res/drawable-land-mdpi/screen.png'] },
            { src: ['screen-960x720.9.png', 'screen-960x720.png'],   dest: ['res/drawable-land-xhdpi/screen.9.png', 'res/drawable-land-xhdpi/screen.png'] },
            { src: ['screen-1410x960.9.png', 'screen-1410x960.png'],  dest: ['res/drawable-land-xxhdpi/screen.9.png', 'res/drawable-land-xxhdpi/screen.png'] },
            { src: ['screen-1880x1280.9.png', 'screen-1880x1280.png'], dest: ['res/drawable-land-xxxhdpi/screen.9.png', 'res/drawable-land-xxxhdpi/screen.png'] },
            { src: ['screen-480x640.9.png', 'screen-480x640.png'],   dest: ['res/drawable-port-hdpi/screen.9.png', 'res/drawable-port-hdpi/screen.png'] },
            { src: ['screen-320x426.9.png', 'screen-320x426.png'],   dest: ['res/drawable-port-ldpi/screen.9.png', 'res/drawable-port-ldpi/screen.png'] },
            { src: ['screen-320x470.9.png', 'screen-320x470.png'],   dest: ['res/drawable-port-mdpi/screen.9.png', 'res/drawable-port-mdpi/screen.png'] },
            { src: ['screen-720x960.9.png', 'screen-720x960.png'],   dest: ['res/drawable-port-xhdpi/screen.9.png', 'res/drawable-port-xhdpi/screen.png'] },
            { src: ['screen-960x1410.9.png', 'screen-960x1410.png'],  dest: ['res/drawable-port-xxhdpi/screen.9.png', 'res/drawable-port-xxhdpi/screen.png'] },
            { src: ['screen-1280x1880.9.png', 'screen-1280x1880.png'], dest: ['res/drawable-port-xxxhdpi/screen.9.png', 'res/drawable-port-xxxhdpi/screen.png'] }
        ],
        wp8 : [
            { src: 'screen-480x800.jpg',  dest: 'SplashScreenImage.jpg' }
        ],
        browser : [ ]
    };

module.exports.copyDefault = function copyDefault(root, platforms, verbose) {
    return copyDefaultAssets(mapping, root, platforms, 'splashscreens', verbose);
};

module.exports.copySplashscreens = function copySplashscreens(root, platform, configuration) {
    return copyAssets(root, mapping, platform, configuration, 'splashscreens');
};

module.exports.generate = function generate(color, root, platforms, config, verbose) {
    return rawGenerate(mapping, color, 'splashscreens', root, platforms, config, verbose);
};
