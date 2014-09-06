var Q = require('q'),
    plist = require('plist'),
    format = require('util').format,
    exec = require('child_process').exec;

var parser = module.exports = function (file_path) {
    var defer = Q.defer(),
        cmd = format('security cms -D -i "%s"', file_path);
    exec(cmd, function (error, stdout, stderr) {
        if (error !== null) {
            defer.reject(error);
        }
        else {
            var out = stdout.toString(),
                plistObject = plist.parse(out),
                provision = {
                    name: null,
                    type: null,
                    uuids:[]
                };

            if(plistObject.Name)
                provision.name = plistObject.Name;

            if(plistObject.ProvisionedDevices)
                provision.uuids = plistObject.ProvisionedDevices;

            if(plistObject.ProvisionedDevices) {
                if(plistObject.Entitlements['get-task-allow'])
                     provision.type = 'debug';
                else
                    provision.type = 'ad-hoc';
            }
            else if(plistObject.ProvisionsAllDevices) {
                provision.type = 'enterprise';
            } else {
                provision.type = 'appstore';
            }

            if (plistObject.UUID)
              provision.uuid = plistObject.UUID;

            return defer.resolve(provision);
        }
    });
    return defer.promise;
};
