var Q = require('q'),
path = require('path'),
rest = require('restler'),
fs = require('fs');

var apiBaseUrl = 'https://rink.hockeyapp.net/api/2';

function uploadVersion(conf) {
    var defer = Q.defer();
    if (!fs.existsSync(filePath)) {
        defer.reject(new Error('Package file "' + filePath + '" not found.'));
    } else {
        // get file size (necessary for multipart upload)
        fs.stat(filePath, function(err, stats) {
            if (err) {
                defer.reject(err);
            } else if (stats.isFile()) {
                var fileSize = stats.size;

                var data = {
                    ipa: rest.file(filePath, null, fileSize, null, null),
                    notes: 'This build ' + filePath.replace(/^.*[\\\/]/, '') + ' was uploaded via tarifa and upload api',
                    notify: 0 // TODO: make configurable
                };

                var headers = {
                    'X-HockeyAppToken': conf.hockeyappToken
                };

                var apiUrl = apiBaseUrl + '/apps/' + conf.localSettings.hockeyapp_id + '/app_versions/upload';

                rest.post(apiUrl, {
                    multipart: true,
                    data: data,
                    headers: headers
                }).on('complete', function(data, response) {
                    if (response.statusCode >= 200 && response.statusCode  < 300) {
                        defer.resolve(data);
                    } else {
                        defer.reject(new Error('['+response.statusCode+'] Failed uploading "' + filePath + '\n' + data.message));
                    }
                });
            }
        });
    }
    return defer.promise;
}

