var qstart = require('qstart'),
    configuration = require('configuration'),
    Zanimo = require('zanimo');

qstart.then(function () {
    var p = window.document.querySelector('p');
    Zanimo(p, 'transform', 'rotate(180deg)', 500, 'ease-in-out').then(function (el) {
        el.innerHTML = 'welcome to ' + configuration.name + ' in configuration ' + configuration.mode;
    });
});
