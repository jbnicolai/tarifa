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
    configurations: [ "development", "staging", "production"],
    // available platforms
    platforms: ['ios', 'android'/* TODO web*/],
    // TODO all needed external cli tools
    // this will be used by tarifa info, to check if we have
    // all tools available
    external:[{
        name : 'ios',
        description : 'Needed to interact with apple provisioning portal',
        install : 'gem install nomad-cli'
    },{
        name : 'adb',
        description: 'android sdk tool'
    }]
}
