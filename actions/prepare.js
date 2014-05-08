module.exports = {
    name : 'prepare',
    help : 'prepare the app for building',
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
