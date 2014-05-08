module.exports = {
    name : 'build',
    help : 'build the app with a given configuration for some targets',
    action : function (options) {
        console.log(options);
    },
    options : [{
        name : 'verbose',
        option : {
            help: "more verbose logs"
        }
    }]
};
