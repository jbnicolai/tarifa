var qstart = require('qstart'),
    configuration = require('configuration'),
    Zanimo = require('zanimo');

qstart.then(function () {
    var p = window.document.querySelector('p');
    Zanimo(p, 'transform', 'scale(0.5)', 500, 'ease-in-out').then(function (el) {
        el.innerHTML = 'welcome to ' + configuration.app_label + ' with id ' + configuration.id;
        return el;
    }).then(Zanimo.f('transform', 'scale(1)', 500, 'ease-in-out'));
});
