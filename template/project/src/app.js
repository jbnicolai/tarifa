var qstart = require('qstart'),
    Q = require('Q'),
    format = require('util').format,
    settings = require('settings'),
    Zanimo = require('zanimo');

qstart.then(function () {
    var p = window.document.querySelector('p.info'),
        defer = Q.defer(),
        logo = window.document.querySelector('.main.circle');

    if(navigator.splashscreen) {
        setTimeout(function () {
            navigator.splashscreen.hide();
            setTimeout(function () {
                defer.resolve();
            }, 2000);
        }, 1000);
    }
    else {
        defer.resolve();
    }

    defer.promise.then(function () {
        return Zanimo(logo, 'transform', 'rotateZ(0deg)', 300, 'ease-in-out');
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
