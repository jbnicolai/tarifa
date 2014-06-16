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
    // the configuration definition
    // a configuration is a kind of variable setting of the project
    configuration : {
        // the visible app name
        app_label : "tarifa example",
        // the bundleid/package of the app
        id: "org.tarifa.example"
    }
}
