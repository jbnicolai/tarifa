var path = require('path'),
    settings = require('../settings'),
    project = [
        'project/path',
        'project/id',
        'project/name',
        'project/description',
        'project/author_name',
        'project/author_email',
        'project/author_href',
        'project/platforms',
        'project/plugins',
        'project/www',
        'project/color',
        'deploy/deploy'
    ];

// add platform specific deploy questions
settings.platforms.forEach(function (platform) {
    var mod = path.resolve(__dirname, '../platforms', platform, 'lib/questions');
    project = project.concat(require(mod));
});

project.push('hockeyapp/hockeyapp');
project.push('hockeyapp/token');

module.exports.project = project;

module.exports.plugin = [
    'plugin/path',
    'plugin/id',
    'plugin/name',
    'plugin/platforms',
    'plugin/version',
    'plugin/description',
    'plugin/author_name',
    'plugin/keywords',
    'plugin/license'
];
