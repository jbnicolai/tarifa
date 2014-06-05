var Q = require('q'),
    pkg = require('../package.json');

module.exports = function (argv) {

    console.log('node version: ' + process.versions.node);
    console.log('cordova version: ' + pkg.dependencies.cordova);

    // check installed xcode version if available
    // check android sdk version
    // check if we are in a tarifa project
    return Q.resolve();
};
