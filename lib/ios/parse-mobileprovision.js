var Q = require('q'),
    plist = require('plist'),
    fs = require('fs');

var parser = module.exports = function (file_path) {

        var provision = {
            name: null,
            type: null,
            uuids:[]
        };

        var content = fs.readFileSync(file_path, 'utf8');
        var start = content.indexOf("<plist");
        var end =  content.indexOf("</plist>") - 196;
        // trim binary data
        content = content.substr(start,end);

        var plistObject = plist.parse(content);

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

        return Q.resolve(provision);
};
