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

function getVersion(filePath) {
    return parse(filePath).then(function (xml) {
        return xml.plugin.$.version;
    });
}

function removePlatforms(file, platforms) {
    return parse(file).then(function (xml) {
        xml.plugin.platform = xml.plugin.platform.filter(function (platform) {
            return platforms.indexOf(platform.$.name) < 0;
        });
        return xml;
    }).then(build(file));
}

function build(file) {
    return function (xml) {
        var builder = new xml2js.Builder({
            renderOpts: { pretty: true, indent: '    ', newline: '\n' },
            xmldec : { "version": "1.0", "encoding": "UTF-8" },
            headless: false
        });
        var xmlString = builder.buildObject(xml);
        fs.writeFileSync(file, xmlString, 'utf-8');
    };
}

module.exports.removePlatforms = removePlatforms;
module.exports.getVersion = getVersion;
