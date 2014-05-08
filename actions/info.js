module.exports = {
    name : 'info',
    help : 'current project information',
    action : function (options) {
        // get some info about the current project
        // which sdk are installed on the current host
    },
    options : [{
        name : 'verbose',
        option : {
            help: "more verbose logs"
        }
    }]
};
