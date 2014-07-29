var settings = require('../../../lib/settings');

module.exports = {
    type : 'checkbox',
    name : 'platforms',
    validate : function (val) { return val.length > 1 || "More than one platform is mandatory!"; },
  	// FIXME, we also need to filter on the platforms which are working in the given platform os host
    choices : settings.platforms.map(function (setting) {
        return { name : setting, value : setting };
    }),
    message : 'What are the supported platform of your project?'
};