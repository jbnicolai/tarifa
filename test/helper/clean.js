var rimraf = require('rimraf');

module.exports = function (projectDefer, tmp, wd) {
    return function () {
        process.chdir(wd);
        tmp.setGracefulCleanup();
        return projectDefer.promise.then(function (obj) {
            rimraf.sync(obj.dirPath);
        });
    };
};
