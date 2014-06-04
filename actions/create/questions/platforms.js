module.exports = {
    type:'checkbox',
    name:'project_targets',
    validate : function (val) { return val.length > 0 || "One platform is mandatory!"; },
    choices:[{
        name:'iOS',
        value:'ios'
    },{
        name:'android',
        value:'android'
    }],
    message:'What are the supported platform of your project?'
};
