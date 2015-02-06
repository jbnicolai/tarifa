var fs = require('fs'),
    Q = require('q'),
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

function getProjectName(file) {
    return parse(file).then(function (xml) {
        return xml.projectDescription.name[0];
    });
}

module.exports.getProjectName = getProjectName;
