var Q = require('q'),
    path = require('path'),
    spinner = require("char-spinner"),
    rest = require('restler'),
    chalk = require('chalk'),
    fs = require('fs'),
    format = require('util').format,
    print = require('../helper/print');

function uploadVersion(filePath, conf) {
    if (!fs.existsSync(filePath))
        return Q.reject(format('Package file "%s" not found', filePath));

    var defer = Q.defer();
    var params = conf.uploadParams;
    var NOTES = "This build %s was was uploaded via tarifa and upload api";

    // get file size (necessary for multipart upload)
    fs.stat(filePath, function(err, stats) {
        if (err) {
            defer.reject(err);
        } else if (stats.isFile()) {
            var fileSize = stats.size,
                notes = format(NOTES, filePath.replace(/^.*[\\\/]/, '')),
                data = {
                    ipa: rest.file(filePath, null, fileSize, null, null),
                    notes: params.notes || notes,
                    notify: params.notify || 0,
                    status: params.status || 1
                };

            if (params.tags) data.tags = params.tags;
            if (params.teams) data.teams = params.teams;
            if (params.users) data.users = params.users;
            if (params.commit_sha) data.commit_sha = params.commit_sha;
            if (params.build_server_url) data.build_server_url = params.build_server_url;
            if (params.repository_url) data.repository_url = params.repository_url;

            var headers = {
                'X-HockeyAppToken': conf.localSettings.hockeyapp.token
            };

            var apiUrl = conf.localSettings.hockeyapp.api_url + '/apps/' +
            conf.hockeyapp_id + '/app_versions/upload';

            spinner();

            rest.post(apiUrl, {
                multipart: true,
                data: data,
                headers: headers
            }).on('complete', function(data, response) {
                if (response.statusCode >= 200 && response.statusCode  < 300) {
                    defer.resolve(data);
                } else {
                    defer.reject(format(
                        "Hockeyap HTTP API ERROR %s, failed uploading %s: \n%s",
                        response.statusCode,
                        filePath,
                        JSON.stringify(data.errors)
                    ));
                }
            });
        }
    });
    return defer.promise;
}

function printVersions(versions) {
    if (versions.length === 0) {
        print.success('no version available');
    }
    else {
        versions.forEach(function (version) {
            print.success(chalk.underline("%s - %s"), version.title, version.shortversion);
            print("  notes: %s", chalk.gray(version.notes));
            print("  config_url: %s", chalk.gray(version.config_url));
            print("  restricted_to_tags: %s", chalk.gray(version.restricted_to_tags));
            print("  status: %s", chalk.gray(version.status));
            print("  tags: %s", chalk.gray(version.tags));
            print("  updated_at: %s", chalk.gray(version.updated_at));
            print("  download_url: %s\n", chalk.gray(version.download_url || chalk.bgYellow(chalk.black("(app not released!!!)"))));
        });
    }
}

function listVersions(conf, verbose) {
    var defer = Q.defer();

    var params = conf.uploadParams;

    var headers = {
        'X-HockeyAppToken': conf.localSettings.hockeyapp.token
    };

    var apiUrl = conf.localSettings.hockeyapp.api_url + '/apps/' +
        conf.hockeyapp_id + '/app_versions';

    spinner();

    rest.get(apiUrl, {
        headers: headers
    }).on('complete', function(data, response) {
        if (response.statusCode >= 200 && response.statusCode  < 300) {
            if (verbose) printVersions(data.app_versions);
            defer.resolve(data);
        } else {
            defer.reject(format("Hockeyap HTTP API ERROR %s, failed to fetch versions!", response.statusCode));
        }
    });

    return defer.promise;
}

function updateVersion(id, conf) {
    var defer = Q.defer();

    var headers = {
        'X-HockeyAppToken': conf.localSettings.hockeyapp.token
    };

    var apiUrl = format("%s/apps/%s/app_versions/%s", conf.localSettings.hockeyapp.api_url, conf.hockeyapp_id, id);

    spinner();

    rest.put(apiUrl, {
        data: conf.uploadParams,
        headers: headers
    }).on('complete', function(data, response) {
        if (response.statusCode >= 200 && response.statusCode  < 300) {
            defer.resolve(data);
        } else {
            defer.reject(format("Hockeyap HTTP API ERROR %s, failed to modify version %s!", response.statusCode, id));
        }
    });

    return defer.promise;
}

function clean(appIds, localSettings, nbToKeep) {

    var headers = {
        'X-HockeyAppToken': localSettings.hockeyapp.token
    };

    var url = localSettings.hockeyapp.api_url + '/apps/APP_ID/app_versions/delete';

    spinner();

    var promises = appIds.map(function(id) {
        var defer = Q.defer();
        var apiUrl = url.replace('APP_ID', id);
        rest.post(apiUrl, {
            data: { keep: nbToKeep.toString() || '3' },
            headers: headers
        }).on('complete', function(data, response) {
            if (response.statusCode >= 200 && response.statusCode  < 300) {
                return defer.resolve(data.total_entries);
            } else {
                return defer.reject(format('Deletion failed for app %s', id));
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
