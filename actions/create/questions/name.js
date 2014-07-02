// TODO validation
// name is the name of the project
// for the android platform, cordova will use it as the class name
// of the main application activity
// -> it muse be a valid java class name

module.exports = {
    type:'input',
    name:'name',
    validate : function (answer) { return answer.length > 0; },
    message:'What\'s the name of your project?'
};
