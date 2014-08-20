var Q = require('q'),
path = require('path'),
spinner = require("char-spinner"),
print = require('./helper/print'),
rest = require('restler'),
fs = require('fs');

function uploadVersion(filePath, conf) {
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
                    notes: 'This build ' + filePath.replace(/^.*[\\\/]/, '') +
                    ' was uploaded via tarifa and upload api',
                    notify: 0 // TODO: make configurable
                };

                var headers = {
                    'X-HockeyAppToken': conf.localSettings.deploy.hockeyapp_token
                };

                var apiUrl = conf.localSettings.deploy.hockeyapp_apiurl + '/apps/' +
                conf.envSettings.hockeyapp_id + '/app_versions/upload';

                print('Uploading to hockeyapp...');
                spinner();

                rest.post(apiUrl, {
                    multipart: true,
                    data: data,
                    headers: headers
                }).on('complete', function(data, response) {
                    if (response.statusCode >= 200 && response.statusCode  < 300) {
                        print.success('Uploading successful');
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

module.exports.uploadVersion = uploadVersion;
