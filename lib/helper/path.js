var path = require('path'),
    fs = require('fs'),
    untildify = require('untildify'),
    settings = require('../settings');

var root = module.exports.root = function () {
    var find = function (dirname) {
        var tarifaFileExists = fs.existsSync(path.join(dirname, settings.publicTarifaFileName));
        if (tarifaFileExists) {
            return dirname;
        } else {
            var isRoot = /^[^\/]*\/$|^[^\\]*\\$/.test(dirname);
            if (isRoot)
                return dirname;
            else
                return find(path.join(dirname, '..'));
        }
    };
    return find(process.cwd());
};

var app = module.exports.app = function () {
    return path.join(root(), settings.cordovaAppPath);
};

var cordova_www = module.exports.cordova_www = function () {
    return path.join(app(), 'www');
};

var platforms = module.exports.platforms = function () {
    return path.join(app(), 'platforms');
};

var resolve = module.exports.resolve = function (p) {
    return path.resolve(untildify(p));
}

module.exports.wwwFinalLocation = function (root, platform) {
    var rslt = path.join(root, settings.cordovaAppPath, 'platforms', platform);
    switch (platform) {
        case 'android':
            rslt = path.join(rslt, 'assets', 'www');
            break;
        case 'ios':
            rslt = path.join(rslt, 'www');
            break;
        case 'wp8':
            rslt = path.join(rslt, 'www');
            break;
        case 'browser':
            rslt = path.join(rslt, 'www');
            break;
        default:
            throw new Error('Platform not supported or unknown');
    }
    return rslt;
};

module.exports.productFile = function (platform, productFileName, mode) {
    var res;
    switch (platform) {
        case 'android':
            res = path.join(platforms(), platform, productFileName + '.apk');
            break;
        case 'ios':
            productFileName = productFileName.replace(/ /g, '\\ ') + '.ipa';
            res = path.join(platforms(), 'ios/build', productFileName);
            break;
        case 'wp8':
            productFileName = productFileName + '.xap';
            res = path.join(platforms(), 'wp8', 'Bin', 'Release', productFileName);
            break;
        default:
            throw new Error('Platform not supported or unknown');

    }
    return res;
};
