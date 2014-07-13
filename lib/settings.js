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
    // the default available configurations
    configurations: ["development", "staging", "production"],
    // available platforms
    platforms: ['ios', 'android', 'web'],
    // used external tools
    external:{
        'ios': {
            name : 'ios',
            description : 'Needed to interact with apple provisioning portal',
            install : 'gem install nomad-cli',
            platform : 'ios',
            print_version: 'ios -v'
        },
        'adb': {
            name : 'adb',
            description: 'android sdk tool',
            platform : 'android',
            print_version: 'adb version'
        },
        'ant': {
            name : 'ant',
            description: 'java build tool',
            platform : 'android',
            print_version: 'ant -version'
        },
        'xcrun': {
            name : 'xcrun',
            description: 'generate ipa files',
            platform : 'ios',
            print_version: 'xcrun --version'
        }
    }
}
