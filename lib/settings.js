var path = require('path');

var settings = {
    // the relative path of the cordova app
    cordovaAppPath : "app",
    // the relative path ot the www project
    webAppPath : "project",
    // the build module needed to build the www project
    // it will be called with the given configuration
    build : "project/bin/build.js",
    // the www project output folder, it will be linked to the
    // cordova www folder during the build
    project_output : "project/www",
    // icons and splashscreens folder
    images : "images",
    // the default available configurations
    configurations: ["dev", "stage", "prod"],
    // available platforms
    platforms: ['ios', 'android', 'wp8', 'browser'],
    // define platforms availability
    os_platforms: {
        'ios' : ['darwin'],
        'android' : ['darwin', 'win32', 'linux'],
        'wp8': ['win32'],
        'browser': ['darwin', 'win32', 'linux']
    },
    // link or copy www project output folder depending on host
    www_link_method: {
        'darwin' : 'link',
        'win32' : 'copy',
        'linux' : 'link'
    },
    // the public tarifa file, it contains project settings that can
    // be shared publicly
    publicTarifaFileName: 'tarifa.json',
    // the private tarifa file, it contains project settings that must
    // not be publicly available
    privateTarifaFileName: 'private.json',
    // default cordova config.xml settings to overwrite
    cordova_config: {
        preferences: {
            DisallowOverscroll: true,
            EnableViewportScale: false,
            KeyboardDisplayRequiresUserAction: false,
            ShowSplashScreenSpinner: false,
            SplashScreen: 'screen',
            BackgroundColor: '0xffffffff',
            AutoHideSplashScreen: false,
            KeepRunning: true
        },
        accessOrigin : [
            '*',
            { origin: 'tel:', external: true }
        ]
    },
    // livereload default port
    livereload_port : 35729,
    // if livereload_port not available, allowed range
    livereload_range: 100,
    // default http server port
    default_http_port: 7042,
    // default external tools
    external: {
        convert: {
            name : 'convert',
            description: 'manipulate images',
            os_platforms: ['darwin', 'win32', 'linux'],
            print_version: 'convert -version'
        },
        identify: {
            name : 'identify',
            description: 'identify images',
            os_platforms: ['darwin', 'win32', 'linux'],
            print_version: 'identify -version'
        }
    }
};

// platform external tools
settings.platforms.forEach(function (platform) {
    var platformSettings = require(path.resolve(__dirname, 'platforms', platform, 'lib/settings'));
    Object.keys(platformSettings.external).forEach(function (tool) {
        settings.external[tool] = platformSettings.external[tool];
    });
    if(platformSettings.main) {
        Object.keys(platformSettings.main).forEach(function (attr) {
            settings[attr] = platformSettings.main[attr];
        });
    }
});

module.exports = settings;
