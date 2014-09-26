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

function has_name(xml, filePath) {
    var defer = Q.defer(),
        err = new Error(format('Can\'t find project attribute `name` in %s', filePath));
    if(xml.project && xml.project.$ && xml.project.$.name) defer.resolve({ value: xml.project.$.name, xml: xml});
    else defer.reject(err);
    return defer.promise;
}

function get(filePath) {
    return parse(filePath).then(function (xml) {
        return has_name(xml, filePath).then(function (result) {
            return result.value;
        });
    });
}

function set(file, name) {
    return parse(file).then(function (xml) {
        return has_name(xml, file).then(function (result) {
            result.xml.project.$.name = name;
            return result.xml;
        });
    }).then(build(file));
}

function build(file) {
    return function (xml) {
        var builder = new xml2js.Builder({
            renderOpts: { pretty: true, indent: '    ', newline: '\n' },
            //xmldec : { "version": "1.0", "encoding": "UTF-8" },
            headless: true
        });
        var xmlString = builder.buildObject(xml);
        fs.writeFileSync(file, xmlString, 'utf-8');
    };
}

module.exports.changeName = set;
module.exports.getName = get;
