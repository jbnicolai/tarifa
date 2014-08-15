var colorHelper = require('../../../lib/helper/color'),
    canGenerate = require('../../../lib/cordova/assets').canGenerate;

module.exports = {
    type:'input',
    name:'color',
    validate: function (response) {
        return colorHelper.validate(response) || "must be a valid imagemagick color"
    },
    filter: colorHelper.format,
    when: function (answers) {
        var done = this.async();
        canGenerate().then(function (ok) {
            done(ok);
        });
    },
    message:'Which color do you want for the default icons and splashscreens?'
};
