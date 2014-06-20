module.exports = {
    type:'input',
    name:'keystore_alias',
    validate : function (answer) { return answer.length > 0 || 'alias can not be empty'; },
    message:'What is the keystore alias?'
};
