module.exports = function (platform, configuration, configurationName, verbose) {

    var browserify = require('browserify');
    var Q = require('q');
    var path = require('path');
    var fs = require('fs');
    var tmp = require('tmp');

    var b = browserify();
    var defer = Q.defer();
    var output = path.join(__dirname, '../www/main.js');

    if(fs.existsSync(output)) fs.unlinkSync(output);

    var ws = fs.createWriteStream(path.join(__dirname, '../www/main.js'));

    tmp.file({ prefix: 'configuration-', postfix: '.json' },function (err, tmpFilePath) {
        if (err) defer.reject(err);
        fs.writeFileSync(tmpFilePath, JSON.stringify(configuration, null, 2));
        b.add(path.join(__dirname, '../src/app.js'))
            .require(tmpFilePath, { expose : 'configuration' })
            .bundle()
            .pipe(ws);

        ws.on('finish', function() {
            tmp.setGracefulCleanup();
            if(verbose)
                console.log('✔ www project build done with configuration ' + configurationName + '!');
            defer.resolve();
        });
    });
    return defer.promise;
}
