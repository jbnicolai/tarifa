var qstart = require('qstart'),
    settings = require('settings'),
    Zanimo = require('zanimo');

qstart.then(function () {
    var p = window.document.querySelector('p');
    Zanimo(p, 'transform', 'scale(0.5)', 500, 'ease-in-out').then(function (el) {
        el.innerHTML = 'welcome to ' + settings.appName + ' with id ' + settings.bundleId + ' with version: ' + settings.version;
        return el;
    }).then(Zanimo.f('transform', 'scale(1)', 500, 'ease-in-out'));
});
