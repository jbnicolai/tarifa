module.exports = {
    name : 'create',
    help : 'create a mobile app',
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
