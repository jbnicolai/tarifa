module.exports = {
    dependency: 'ios',
    type:'input',
    name:'apple_developer_team',
    // TODO should be a valid apple developer team
    validate : function (response) { return response.length > 0; },
    message:'What is your developer apple team id?'
};
