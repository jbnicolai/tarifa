var qstart = require('qstart'),
    configuration = require('configuration'),
    Zanimo = require('zanimo');

qstart.then(function () {
    var p = window.document.querySelector('p');
    Zanimo(p, 'transform', 'scale(2)', 500, 'ease-in-out').then(function (el) {
        el.innerHTML = 'welcome to ' + configuration.app_name + ' in configuration ' + configuration.name;
    });
});
