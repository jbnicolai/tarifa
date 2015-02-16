var path = require('path'),
    dir = __dirname;

module.exports.commands = [
    {
        def: ['ios', 'devices', 'list', '*'],
        action: function (_, verbose) {
            return require(path.join(dir, 'devices')).list(_[3], verbose);
        }
    },
    {
        def: ['ios', 'devices', 'add', '+', '+'],
        action: function (_, verbose) {
            return require(path.join(dir, 'devices')).add(_[3], _[4], verbose);
        }
    },
    {
        def: ['ios', 'devices', 'attach', '+', '+'],
        action: function (_, verbose) {
            return require(path.join(dir, 'devices')).attach(_[3], _[4], verbose);
        }
    },
    {
        def: ['ios', 'devices', 'detach', '+', '+'],
        action: function (_, verbose) {
            return require(path.join(dir, 'devices')).detach(_[3], _[4], verbose);
        }
    },
    {
        def: ['provisioning', 'list'],
        action: function (_, verbose) {
            return require(path.join(dir, 'provisioning')).list(verbose);
        }
    },
    {
        def: ['provisioning', 'fetch'],
        action: function (_, verbose) {
            return require(path.join(dir, 'provisioning')).fetch(verbose);
        }
    },
    {
        def: ['provisioning', 'info', '*'],
        action: function (_, verbose) {
            return require(path.join(dir, 'provisioning')).info(_[2], verbose);
        }
    }
];
