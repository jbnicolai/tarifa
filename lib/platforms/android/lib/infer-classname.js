
module.exports = function (string) {
    return string.replace(/[\W\s\d]/g, '_');
};
