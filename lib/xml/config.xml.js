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

function get(filePath) {
    return parse(filePath).then(function (xml) {
        return {
            id: xml.widget.$.id,
            version: xml.widget.$.version,
            author_name: xml.widget.author[0]._,
            author_email: xml.widget.author[0].$.email,
            author_href: xml.widget.author[0].$.href,
            description: xml.widget.description[0],
            preference: xml.widget.preference.map(function (pref) {
                return { name: pref.$.name, value: pref.$.value };
            }),
            access: xml.widget.access[0].$.origin.split(',')
        };
    });
}

function set(file, id, version, author_name, author_email, author_href, description, preference, access) {
    return parse(file).then(function (xml) {
        xml.widget.$.id = id;
        if(version) xml.widget.$.version = version;
        if(author_name) xml.widget.author[0]._ = author_name;
        if(author_email) xml.widget.author[0].$.email = author_email;
        if(author_href) xml.widget.author[0].$.href = author_href;
        if(description) xml.widget.description[0] = description;
        if(access) xml.widget.access[0].$.origin = access.join(',');
        if(preference) {
            xml.widget.preference = [];
            preference.forEach(function (pref) {
                xml.widget.preference.push({
                    $: {
                        name: pref.name,
                        value: pref.value
                    }
                });
            });
        }
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

module.exports.set = set;
module.exports.get = get;
