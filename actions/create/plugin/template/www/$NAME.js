module.exports.life = function (success, error, oldVal) {
    if (typeof oldVal !== 'string') {
        error('life must be called with a single string parameter.');
    } else {
        var wrappedSuccess = function (newVal) {
            success(oldVal + ' was born in javascript. It went into the native world and became ' + newVal + ' but returned shortly after to its world of birth.');
        };
        cordova.exec(wrappedSuccess, error, '$NAME', 'life', [oldVal]);
    }
};
