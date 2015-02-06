var Q = require('q'),
    path = require('path'),
    format = require('util').format,
    projectXml = require('../../xml/android/project');

module.exports = function check_android(cordova_root, obj) {
    var projectFilePath = path.join(cordova_root, 'platforms', 'android', '.project');
    return projectXml.getProjectName(projectFilePath).then(function (name) {
        if(name !== obj.name)
            return Q.reject(format('No android project named %s, change tarifa.json name attribute!', obj.name));
        else return obj;
    });
};
