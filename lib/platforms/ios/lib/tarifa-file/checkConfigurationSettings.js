var Q = require('q'),
    format = require('util').format,
    validator = require('../../../../helper/validator');

module.exports = function (obj, platformPath) {
    if(!validator.isBundleId(obj.id.trim()))
        return Q.reject(format('[%s.id] %s', platformPath, validator.isBundleId.error));
    else return Q(obj);
};
