/*
 * config.js - manage the cordova config.xml file
 */

var libxmljs = require('libxmljs'),
    fs = require("q-io/fs");

var config = {};

config.id = function(path, id) {
    return fs.read(path).then(function (xmlContent) {
        var doc = libxmljs.parseXml(xmlContent.replace('\n', ''), { noblanks: true });
        doc.root().attr('id', id);
        return fs.write(path, doc.toString());
    });
};

config.config = function (path, version, author, description, preferences, access) {

    function findAll(items, name) {
        return items.filter(function (item) {
            return item.name() === name;
        });
    }

    function find(items, name) {
        return findAll(items, name)[0];
    }

    return fs.read(path).then(function (xmlContent) {
        var doc = libxmljs.parseXml(xmlContent.replace('\n', ''), { noblanks: true });
        var elts = doc.find('*');

        find(elts, 'access').attr('origin', access.join(','));
        doc.root().attr('version', version);
        find(elts, 'description').text(description);
        find(elts, 'author')
            .text(author.name)
            .attr('email', author.email)
            .attr('href', author.href);

        var nodes = findAll(elts, 'preference');

        for(var preference in preferences) {

            var node = nodes.filter(function (el) {
                return el.attr('name').value() === preference;
            })[0];

            if (node) {
                node.attr('value', preferences[preference]);
            } else {
                doc.root()
                    .node('preference')
                    .attr('name', preference)
                    .attr('value', preferences[preference]);
            }
        }
        return fs.write(path, doc.toString());
    });
};

module.exports = config;
