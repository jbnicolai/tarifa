var qstart = require('qstart'),
    Q = require('q'),
    format = require('util').format,
    settings = require('settings'),
    Zanimo = require('zanimo');

qstart.then(function () {
    var p = document.querySelector('p.info'),
        logo = document.querySelector('.main.circle'),
        hide = navigator.splashscreen ? navigator.splashscreen.hide : function () {};

    return Q.delay(500).then(hide).then(function () {
        return Q.delay(logo, 500).then(Zanimo.f('transform', 'rotateZ(0deg)', 300, 'ease-in-out'));
    }).then(function () {
        p.innerHTML = format(
            '<dl><dt>name</dt><dd>%s</dd><dt>id</dt><dd>%s</dd><dt>version</dt><dd>%s</dd></dl>',
            settings.appName,
            settings.bundleId,
            settings.version
        );
        return p;
    }).then(Zanimo.f('display', 'block')).then(Zanimo.f('opacity', 1, 400));
});
