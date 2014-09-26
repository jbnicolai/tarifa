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

function has_format(xml, filePath) {
    var defer = Q.defer(),
        err = new Error(format('%s has a wrong format, searching for Package xml root', filePath));
    if(xml.Package && xml.Package.Identity && xml.Package.Properties && xml.Package.Applications)
        defer.resolve(xml);
    else defer.reject(err);
    return defer.promise;
}

function get(filePath) {
    return parse(filePath).then(function (xml) {
        return has_format(xml, filePath).then(function () {
            return {
                id: xml.Package.Identity[0].$.Name,
                name: xml.Package.Properties[0].DisplayName[0],
                publisher: xml.Package.Identity[0].$.Publisher,
                description: xml.Package.Applications[0].Application[0].VisualElements[0].$.Description
            };
        });
    });
}

function set(file, id, name, publisher, description) {
    return parse(file).then(function (xml) {
        return has_format(xml, file).then(function () {
            xml.Package.Identity[0].$.Name = id;
            xml.Package.Properties[0].DisplayName[0] = name;
            xml.Package.Identity[0].$.Publisher = publisher;
            xml.Package.Applications[0].Application[0].VisualElements[0].$.Description = description;
            xml.Package.Applications[0].Application[0].VisualElements[0].$.DisplayName = name;
            xml.Package.Applications[0].Application[0].$.Id = id;
            return xml;
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
        fs.writeFileSync(file, "<?xml version='1.0' encoding='utf-8'?>\n" + xmlString, 'utf-8');
    };
}

module.exports.set = set;
module.exports.get = get;
