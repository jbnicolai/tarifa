var fs = require('fs'),
    Q = require('q'),
    format = require('util').format,
    xml2js = require('xml2js');

function parse(file) {
    var xml = fs.readFileSync(file, 'utf-8'),
        defer = Q.defer();

    xml2js.parseString(xml, function (err, result) {
        if(err) return defer.reject(err);
        defer.resolve(result);
    });
    return defer.promise;
}

function has_versionCode(xml, filePath) {
    var defer = Q.defer(),
        err = new Error(format('Can\'t find manifest attribute `android:versionCode` in %s', filePath));
    if(xml.manifest && xml.manifest.$ && xml.manifest.$['android:versionCode'])
        defer.resolve({ value: xml.manifest.$['android:versionCode'], xml: xml});
    else
        defer.reject(err);
    return defer.promise;
}

function get(filePath) {
    return parse(filePath).then(function (xml) {
        return has_versionCode(xml, filePath).then(function (result) {
            return result.value;
        });
    });
}

function set(file, code) {
    return parse(file).then(function (xml) {
        return has_versionCode(xml, file).then(function (result) {
            result.xml.manifest.$['android:versionCode'] = code;
            return result.xml;
        });
    }).then(build(file));
}

function build(file) {
    return function (xml) {
        var builder = new xml2js.Builder({
            renderOpts: { pretty: true, indent: '    ', newline: '\n' },
            headless: true
        });
        var xmlString = builder.buildObject(xml);
        fs.writeFileSync(file, xmlString, 'utf-8');
    };
}

module.exports.setVersionCode = set;
module.exports.getVersionCode = get;
