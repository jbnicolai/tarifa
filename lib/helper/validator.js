var rawIsJavaIdentifier = require('valid-java-identifier');

function isBundleId(str) {
    if (typeof str !== 'string') return false;
    return /^[A-Z,a-z,0-9,-,.]+$/.test(str);
};

function isEmail(str) {
    if (typeof str !== 'string') return false;
    // source: https://github.com/chriso/validator.js
    var regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
    return regex.test(str);
};

function isId(str) {
    return isBundleId(str) && isJavaPackageName(str);
};

function isJavaIdentifier(str) {
    return rawIsJavaIdentifier(str);
};

function isJavaPackageName(str) {
    if (typeof str !== 'string') return false;

    var rslt = str.split('.');

    return rslt.filter(function (name) {
        return rawIsJavaIdentifier(name);
    }).length === rslt.length;
};

function isProductFileName(str) {
    if (typeof str !== 'string') return false;
    return /^[\w,-,_,0-9]+$/.test(str);
};

function isProductName(str) {
    return typeof str === 'string';
};

function isUrl(str) {
    if (typeof str !== 'string') return false;
    // source: http://code.tutsplus.com/tutorials/8-regular-expressions-you-should-know--net-6149
    return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(str);
};

isBundleId.error        = "must be a string that contains only alphanumeric characters (A-Z, a-z, 0-9), hyphen (-) and period (.)";
isEmail.error           = "must be a valid email";
isId.error              = "must be a valid Java package name that does not contain any hyphen (-) or underscore (_)"
isJavaIdentifier.error  = "must be a valid Java identifier";
isJavaPackageName.error = "must be a valid Java package name";
isProductFileName.error = "must be a valid ASCII string";
isProductName.error     = "must be a valid product name";
isUrl.error             = "must be a valid URL";

function toInquirerValidateƒ(ƒ) {
    return function(str) {
        return ƒ(str) || ƒ.error;
    }
}

module.exports = {
    isBundleId:          isBundleId,
    isEmail:             isEmail,
    isId:                isId,
    isJavaIdentifier:    isJavaIdentifier,
    isJavaPackageName:   isJavaPackageName,
    isProductFileName:   isProductFileName,
    isProductName:       isProductName,
    isUrl:               isUrl,
    toInquirerValidateƒ: toInquirerValidateƒ
};
