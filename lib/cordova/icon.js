var copyDefaultAssets = require('./assets').copyDefaultAssets,
    copyAssets = require('./assets').copyAssets,

    mapping = {
        ios : [
            { src: 'icon-40.png',    dest: '{$app_name}/Resources/icons/icon-40.png' },
            { src: 'icon-40@2x.png', dest: '{$app_name}/Resources/icons/icon-40@2x.png' },
            { src: 'icon-50.png',    dest: '{$app_name}/Resources/icons/icon-50.png' },
            { src: 'icon-50@2x.png', dest: '{$app_name}/Resources/icons/icon-50@2x.png' },
            { src: 'icon-60.png',    dest: '{$app_name}/Resources/icons/icon-60.png' },
            { src: 'icon-60@2x.png', dest: '{$app_name}/Resources/icons/icon-60@2x.png' },
            { src: 'icon-72.png',    dest: '{$app_name}/Resources/icons/icon-72.png' },
            { src: 'icon-72@2x.png', dest: '{$app_name}/Resources/icons/icon-72@2x.png' },
            { src: 'icon-76.png',    dest: '{$app_name}/Resources/icons/icon-76.png' },
            { src: 'icon-76@2x.png', dest: '{$app_name}/Resources/icons/icon-76@2x.png' },
            { src: 'icon-29.png',    dest: '{$app_name}/Resources/icons/icon-small.png' },
            { src: 'icon-29@2x.png', dest: '{$app_name}/Resources/icons/icon-small@2x.png' },
            { src: 'icon-57.png',    dest: '{$app_name}/Resources/icons/icon.png' },
            { src: 'icon-57@2x.png', dest: '{$app_name}/Resources/icons/icon@2x.png' }
        ],
        android : [
            { src: 'icon-36.png',    dest: 'res/drawable-ldpi/icon.png' },
            { src: 'icon-48.png',    dest: 'res/drawable-mdpi/icon.png' },
            { src: 'icon-72.png',    dest: 'res/drawable-hdpi/icon.png' },
            { src: 'icon-96.png',    dest: 'res/drawable-xhdpi/icon.png' },
            { src: 'icon-144.png',   dest: 'res/drawable-xxhdpi/icon.png' },
            { src: 'icon-192.png',   dest: 'res/drawable-xxxhdpi/icon.png' },
            { src: 'icon-96.png',    dest: 'res/drawable/icon.png' }
        ]
    };

module.exports.copyDefault = function copyDefault(root, platforms, verbose) {
    return copyDefaultAssets(mapping, root, platforms, 'icons', verbose);
};

module.exports.copyIcons = function copyIcons(platform, configuration) {
    return copyAssets(mapping, platform, configuration, 'icons');
};
