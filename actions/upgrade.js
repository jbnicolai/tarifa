module.exports = {
    name : 'upgrade',
    help : 'upgrade current project',
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
