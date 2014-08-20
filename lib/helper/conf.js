// find all values for key, deeply
var findByKey = module.exports.findByKey = function (object, key, acc) {
    if (acc === undefined) acc = [];

    for (var prop in object) {
        if (prop === key)
            acc.push(object[prop]);
        if (object[prop] instanceof Object)
            findByKey(object[prop], key, acc);
    }

    return acc;
};
