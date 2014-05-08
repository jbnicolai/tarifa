module.exports = {
    name : 'run',
    help : 'run mobile app on attached devices',
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
