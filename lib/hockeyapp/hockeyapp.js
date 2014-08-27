var Q = require('q'),
path = require('path'),
spinner = require("char-spinner"),
print = require('../helper/print'),
rest = require('restler'),
fs = require('fs');

function uploadVersion(filePath, conf) {
    var defer = Q.defer();

    var params = conf.uploadParams;

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
                    notes: params.notes || 'This build ' + filePath.replace(/^.*[\\\/]/, '') +
                    ' was uploaded via tarifa and upload api',
                    notify: params.notify || 0,
                    status: params.status || 1
                };

                if (params.tags) data.tags = params.tags;
                if (params.teams) data.teams = params.teams;
                if (params.users) data.users = params.users;

                var headers = {
                    'X-HockeyAppToken': conf.localSettings.hockeyapp.token
                };

                var apiUrl = conf.localSettings.hockeyapp.api_url + '/apps/' +
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
                        defer.reject(new Error('['+response.statusCode+'] Failed uploading "' + filePath + '\n' + JSON.stringify(data.errors)));
                    }
                });
            }
        });
    }
    return defer.promise;
}

function listVersions(conf) {
    var defer = Q.defer();

    var params = conf.uploadParams;

    var headers = {
        'X-HockeyAppToken': conf.localSettings.hockeyapp.token
    };

    var apiUrl = conf.localSettings.hockeyapp.api_url + '/apps/' +
        conf.envSettings.hockeyapp_id + '/app_versions';

    print('Fetching app versions...');
    spinner();

    rest.get(apiUrl, {
        headers: headers
    }).on('complete', function(data, response) {
        if (response.statusCode >= 200 && response.statusCode  < 300) {
            defer.resolve(data);
        } else {
            defer.reject(new Error('['+response.statusCode+'] Failed to fetch versions.'));
        }
    });

    return defer.promise;
}

function updateVersion(id, conf) {
    var defer = Q.defer();

    var params = conf.uploadParams;

    var data = {
        notify: params.notify || 0,
        status: params.status || 1
    };

    if (params.tags) data.tags = params.tags;
    if (params.teams) data.teams = params.teams;
    if (params.users) data.users = params.users;

    var headers = {
        'X-HockeyAppToken': conf.localSettings.hockeyapp.token
    };

    var apiUrl = conf.localSettings.hockeyapp.api_url + '/apps/' +
        conf.envSettings.hockeyapp_id + '/app_versions/' + id;

    print('Modifying app version ' + id + '...');
    spinner();

    rest.put(apiUrl, {
        data: data,
        headers: headers
    }).on('complete', function(data, response) {
        if (response.statusCode >= 200 && response.statusCode  < 300) {
            print.success('Updated version successfully.');
            defer.resolve(data);
        } else {
            defer.reject(new Error('['+response.statusCode+'] Failed to modify version "' + id));
        }
    });

    return defer.promise;
}

function clean(appIds, localSettings, nbToKeep) {

    var headers = {
        'X-HockeyAppToken': localSettings.hockeyapp.token
    };

    var url = localSettings.hockeyapp.api_url + '/apps/APP_ID/app_versions/delete';

    var errors = false;

    print('Deleting hockeyapp versions...');
    spinner();

    var promises = appIds.map(function(id) {
        var defer = Q.defer();
        var apiUrl = url.replace('APP_ID', id);
        rest.post(apiUrl, {
            data: { keep: nbToKeep || 3 },
            headers: headers
        }).on('complete', function(data, response) {
            if (response.statusCode >= 200 && response.statusCode  < 300) {
                return defer.resolve(data.total_entries);
            } else {
                errors = true;
                return defer.reject('Deletion failed for app ' + id);
            }
        });
        return defer.promise;
    });

    return Q.all(promises).then(function (results) {
        return results.reduce(function(acc, val) {
            return acc + val;
        }, 0);
    });
}

module.exports = {
    listVersions: listVersions,
    uploadVersion: uploadVersion,
    updateVersion: updateVersion,
    clean: clean
};
