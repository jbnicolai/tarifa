var Q = require('q'),
    path = require('path'),
    fs = require('q-io/fs'),
    print = require('../../../../lib/helper/print'),
    settings = require('../../../../lib/settings');

module.exports = function (msg) {
    var cwd = process.cwd();
    var assemblyPath = path.join(cwd, settings.cordovaAppPath, 'platforms', 'wp8', 'Properties', 'AssemblyInfo.cs');
    var product_file_name = msg.localSettings.configurations.wp8[msg.configuration]['product_file_name'];
    var guid = msg.localSettings.configurations.wp8[msg.configurations]['guid'];
    var author = msg.localSettings.author.name;
    var year = (new Date()).getFullYear();
    var v = msg.localSettings.version + '.0';

    var title = "AssemblyTitle(\"" + product_file_name + "\")";
    var company = "AssemblyCompany(\"" + author + "\")";
    var product = "AssemblyProduct(\"" + product_file_name + "\")";
    var copyright = "AssemblyCopyright(\"Copyright © " + author + " " + year + "\")";
    var trademark = "AssemblyTrademark(\"" + author + "\")";
    var guid =  "Guid(\"" + guid + "\")";
    var version =  "AssemblyVersion(\"" + v + "\")";

    return fs.read(assemblyPath).then(function (assemblyContent) {
        var content = assemblyContent.replace(/AssemblyTitle\(.*\)/, title)
                        .replace(/AssemblyCompany\(.*\)/, company)
                        .replace(/AssemblyProduct\(.*\)/, product)
                        .replace(/AssemblyCopyright\(.*\)/, copyright)
                        .replace(/AssemblyTrademark\(.*\)/, trademark)
                        .replace(/AssemblyVersion\(.*\)/, version)
                        .replace(/Guid\(.*\)/, guid);

        return fs.write(assemblyPath, content);
    }).then(function () {
        if(msg.verbose)
            print.success('changed AssemblyInfo.cs');
        return msg;
    });
};
