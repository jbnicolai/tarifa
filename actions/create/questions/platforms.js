var settings = require('../../../lib/settings');

module.exports = {
    type : 'checkbox',
    name : 'platforms',
    validate : function (val) { return val.length > 0 || "One platform is mandatory!"; },
    choices : settings.platforms.map(function (setting) {
        return { name : setting, value : setting };
    }),
    message : 'What are the supported platform of your project?'
};
