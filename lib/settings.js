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
    // output folder, where we put ipa, apk...
    output_folder : "output",
    // icons and splashscreens folder
    images : "images",
    // the default available configurations
    configurations: ["development", "staging", "production"],
    // available platforms
    platforms: ['ios', 'android', 'wp8', 'web'],
    // define platforms availability
    os_platforms: {
        'ios' : ['darwin'],
        'android' : ['darwin', 'win32', 'linux'],
        'wp8': ['win32'],
        'web': ['darwin', 'win32', 'linux']
    },
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
            AutoHideSplashScreen: true,
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
        'ant': {
            name : 'ant',
            description: 'java build tool',
            platform : 'android',
            os_platforms: ['win32', 'linux', 'darwin'],
            print_version: 'ant -version'
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
        }
    }
}
