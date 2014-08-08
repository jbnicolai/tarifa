var colorHelper = require('../../../lib/helper/color');

module.exports = {
    type:'input',
    name:'color',
    validate: function (response) {
        return colorHelper.validate(response) || "color must be a valid imagemagick color!"
    },
    filter: colorHelper.format,
    message:'Which color do you want for the default icons and splashscreens?'
};
