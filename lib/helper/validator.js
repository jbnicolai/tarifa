var path = require('path'),
    fs = require('fs'),
    rawIsJavaIdentifier = require('valid-java-identifier'),
    colorHelper = require('./color');

function isAndroidPackageName(str) {
    return isJavaPackageName(str, 2);
};

function isAppleDeveloperTeam(str) {
    return typeof str === 'string' && str.length > 0;
};

function isBundleId(str) {
    return typeof str === 'string' && /^[A-Z,a-z,0-9,-,.]+$/.test(str);
};

function isColor(str) {
    return typeof str === 'string' && colorHelper.validate(str);
};

function isDescription(str) {
    return typeof str === 'string' && str.length > 0;
};

function isEmail(str) {
    // source for regex: https://github.com/chriso/validator.js
    var regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
    return typeof str === 'string' && regex.test(str);
};

function isJavaIdentifier(str) {
    return rawIsJavaIdentifier(str);
};

function isJavaPackageName(str, minDepth) {
    if (typeof str !== 'string') return false;
    if (minDepth === undefined || minDepth < 1) minDepth = 1;

    var rslt = str.split('.');

    return rslt.filter(function (name) {
        return rawIsJavaIdentifier(name);
    }).length === rslt.length && rslt.length >= minDepth;
};

function isKeystoreAlias(str) {
    return typeof str === 'string' && str.length > 0;
};

function isProductFileName(str) {
    return typeof str === 'string' && /^[\w,-,_,0-9]+$/.test(str);
};

function isProductName(str) {
    return typeof str === 'string' && str.length > 0;
};

function isProjectId(str) {
    return isBundleId(str) && isAndroidPackageName(str);
};

function isProjectPath(str) {
    if (typeof str !== 'string' || str.length === 0) return false;
    var resolvedPath = path.resolve(str);
    return !fs.existsSync(resolvedPath) || fs.readdirSync(resolvedPath).length == 0;
};

function isUrl(str) {
    // source for regex: http://code.tutsplus.com/tutorials/8-regular-expressions-you-should-know--net-6149
    var regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return typeof str === 'string' && regex.test(str);
};

isAndroidPackageName.error = "must be a valid Java package name, with a minimum depth of 2";
isAppleDeveloperTeam.error = "must be non-empty";
isBundleId.error           = "must be a string that contains only alphanumeric characters (A-Z, a-z, 0-9), hyphen (-) and period (.)";
isColor.error              = "must be a valid imagemagick color";
isDescription.error        = "must be non-empty";
isEmail.error              = "must be a valid email";
isJavaIdentifier.error     = "must be a valid Java identifier";
isJavaPackageName.error    = "must be a valid Java package name";
isKeystoreAlias.error      = "must be non-empty";
isProductFileName.error    = "must be a valid ASCII string";
isProductName.error        = "must be a valid product name";
isProjectId.error          = "must be a valid Java package name, with a minimum depth of 2 and that does not contain any hyphen (-) or underscore (_)"
isProjectPath.error        = "must be a non-existing or empty folder";
isUrl.error                = "must be a valid URL";

function toInquirerValidateƒ(ƒ) {
    return function(str) {
        return ƒ(str) || ƒ.error;
    }
};

module.exports = {
    isAndroidPackageName: isAndroidPackageName,
    isAppleDeveloperTeam: isAppleDeveloperTeam,
    isBundleId:           isBundleId,
    isColor:              isColor,
    isDescription:        isDescription,
    isEmail:              isEmail,
    isJavaIdentifier:     isJavaIdentifier,
    isJavaPackageName:    isJavaPackageName,
    isKeystoreAlias:      isKeystoreAlias,
    isProductFileName:    isProductFileName,
    isProductName:        isProductName,
    isProjectId:          isProjectId,
    isProjectPath:        isProjectPath,
    isUrl:                isUrl,
    toInquirerValidateƒ:  toInquirerValidateƒ
};
