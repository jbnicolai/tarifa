var Q = require('q'),
    fs = require('q-io/fs'),
    path = require('path'),
    format = require('util').format,
    settings = require('../../settings'),
    projectXml = require('../../xml/android/project');

function check_ios(root, obj) {
    var project_folder = path.join(root, settings.cordovaAppPath, 'platforms', 'ios', obj.name),
        xcodeproj_path = format("%s.%s", project_folder, 'xcodeproj');

    return Q.all([fs.exists(project_folder), fs.exists(xcodeproj_path)])
        .spread(function (project_folder_exists, xcodeproj_path_exists) {
            if(!project_folder_exists || !xcodeproj_path_exists)
                return Q.reject(format('No xcode project named %s, change tarifa.json name attribute!', obj.name));
            else return obj;
        });
}

function check_android(root, obj) {
    var projectFilePath = path.join(root, settings.cordovaAppPath, 'platforms', 'android', '.project');
    return projectXml.getProjectName(projectFilePath).then(function (name) {
        if(name !== obj.name)
            return Q.reject(format('No android project named %s, change tarifa.json name attribute!', obj.name));
        else return obj;
    });
}

module.exports = function (root, platform) {
    return function (obj) {
        switch(platform){
            case 'ios':
                return check_ios(root, obj);
            case 'android':
                return check_android(root, obj);
            default:
                return obj;
        }
    };
};
