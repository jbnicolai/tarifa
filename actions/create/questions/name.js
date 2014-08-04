var validJavaIdentifier = require('valid-java-identifier');

module.exports = {
    type:'input',
    name:'name',
    validate : function (response) {
        return validJavaIdentifier(response) || "It must me a valid java identifier!";
    },
    message:'What\'s the name of your project?'
};
