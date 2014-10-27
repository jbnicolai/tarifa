var Q = require('q'),
    format = require('util').format,
    exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    path = require('path'),
    Configstore = require('configstore'),
    print = require('../../../../lib/helper/print'),
    pathHelper = require('../../../../lib/helper/path'),
    settings = require('../../../../lib/settings'),
    confStore = new Configstore('tarifa');

function openChromeOnDarwin(conf) {
    var defer = Q.defer(),
        cmd = path.join('platforms', 'browser', 'cordova', 'run'),
        options = {
            cwd: pathHelper.app(),
            timeout : 100000,
            maxBuffer: 1024 * 400
        };

    if(conf.verbose)
        print.success('trying to open browser!');

    exec(cmd, options, function (err, stdout, stderr) {
        if(err) {
            if(conf.verbose) {
                print.error('command: %s', cmd);
                print.error('stderr %s', stderr);
            }
            defer.reject(cmd + ' command failed;');
        }
        else {
            defer.resolve(conf);
        }
    });

    return defer.promise;
}

function openChromeOnWin32(conf) {
    var indexPath = path.resolve(pathHelper.app(), 'platforms', 'browser', 'www', 'index.html'),
        project = format('file://%s', indexPath);
        child = spawn(
            confStore.get('chrome') || 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
            ['--user-data-dir=C:/Chromedevsession', '--disable-web-security', project],
            { detached: true , stdio:'ignore'}
        );

    child.unref();
    return Q.resolve(conf);
}

function openChromeOnLinux(conf) {
    var indexPath = path.resolve(pathHelper.app(), 'platforms', 'browser', 'www', 'index.html'),
        project = format('file://%s', indexPath);
        child = spawn(
            confStore.get('chrome') || 'chrome-browser',
            ['--user-data-dir=/tmp/temp_chrome_user_data_dir_for_cordova_browser', '--disable-web-security', project],
            { detached: true , stdio:'ignore'}
        );

    child.on('error', function (err){
        if(err.code === 'ENOENT') print.error('can not find chrome executable, check your configstore, ~/.config/configstore/tarifa.yml and add a chrome attribute pointing to your chrome or chromium executable');
	else print.stack(err);
    });
    child.unref();
    return Q.resolve(conf);
}

module.exports = function (conf) {
    switch(process.platform) {
        case 'darwin':
            return openChromeOnDarwin(conf);
        case 'win32':
            return openChromeOnWin32(conf);
        case 'linux':
            return openChromeOnLinux(conf);
        default:
            return Q.reject(format('Can not run on platform %s!', process.platform));
    }
};
