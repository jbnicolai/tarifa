var path = require('path');

var cordovaDeployPath = path.resolve(path.join(
        __dirname,
        '..',
        'node_modules',
        'cordova-deploy-windows-phone',
        'CordovaDeploy',
        'bin',
        'Release',
        'CordovaDeploy.exe'
    ));

module.exports = {
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
    // the key used to store which parsed tarifa.json & private.json attributes
    // are private
    parsedPrivateKeys: 'parsedPrivateKeys:cad4f250-6270-11e4-9803-0800200c9a66',
    // default cordova config.xml settings to overwrite
    cordova_config: {
        preferences: {
            DisallowOverscroll: true,
            EnableViewportScale: false,
            KeyboardDisplayRequiresUserAction: false,
            ShowSplashScreenSpinner: false,
            HideKeyboardFormAccessoryBar: false,
            SplashScreen: 'screen',
            BackgroundColor: '0xffffffff',
            AutoHideSplashScreen: false,
            KeyboardShrinksView: true,
            KeepRunning: true
        },
        accessOrigin : ['*']
    },
    // default apple developer identity
    default_apple_developer_identity: 'iPhone Developer',
    // used external tools
    external:{
        'ios': {
            name : 'ios',
            description : 'Needed to interact with apple provisioning portal',
            install : 'gem install nomad-cli',
            platform : 'ios',
            os_platforms: ['darwin'],
            print_version: 'ios -v'
        },
        'adb': {
            name : 'adb',
            description: 'android sdk tool',
            platform : 'android',
            os_platforms: ['win32', 'linux', 'darwin'],
            print_version: 'adb version'
        },
        'xcrun': {
            name : 'xcrun',
            description: 'generate ipa files',
            platform : 'ios',
            os_platforms: ['darwin'],
            print_version: 'xcrun --version'
        },
        'convert': {
            name : 'convert',
            description: 'manipulate images',
            os_platforms: ['darwin', 'win32', 'linux'],
            print_version: 'convert -version'
        },
        'identify': {
            name : 'identify',
            description: 'identify images',
            os_platforms: ['darwin', 'win32', 'linux'],
            print_version: 'identify -version'
        },
        'cordovadeploy' : {
            name : cordovaDeployPath,
            description: 'deploy app to device',
            os_platforms: ['win32']
        }
    }
}
