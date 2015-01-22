var Q = require('q'),
    format = require('util').format,
    devices = require('../../lib/devices'),
    ask = require('../../lib/questions/ask');

module.exports = function (conf) {

    if (conf.platform === 'browser')
        return Q(conf);
    if(!devices[conf.platform])
        return Q.reject(format("Get devices for platform %s not implemented!", conf.platform));

    return devices[conf.platform]().then(function (items) {
        if (items.length === 0)
            return Q.reject("No device available!");

        if (items.length === 1) {
            conf.device = { value: items[0], index : 0 };
            return conf;
        }

        return ask.question(
            'Which device do you want to use?',
            'list',
            ['all'].concat(items)
        ).then(function (resp) {
            conf.device = (resp !== 'all')
                ? { value: resp, index : items.indexOf(resp) }: items;
            return conf;
        });
    });
};
