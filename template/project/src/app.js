var qstart = require('qstart'),
    Q = require('Q'),
    format = require('util').format,
    settings = require('settings'),
    Zanimo = require('zanimo');

qstart.then(function () {
    var p = window.document.querySelector('p.info'),
        logo = window.document.querySelector('.main.circle');

    return Q.delay(500).then(navigator.splashscreen.hide).then(function () {
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
