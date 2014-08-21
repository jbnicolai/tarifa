module.exports.mergeObject = function (obj1, obj2) {
    var obj3 = {};
    for (var attr1 in obj1) { obj3[attr1] = obj1[attr1]; }
    for (var attr2 in obj2) { obj3[attr2] = obj2[attr2]; }

    return obj3;
};


// find all values for key, deeply
var findByKey = module.exports.findByKey = function (object, key, acc) {
    if (acc === undefined) acc = [];

    for (var prop in object) {
        if (prop === key)
            acc.push(object[prop]);
        if (object[prop] instanceof Object)
            acc = findByKey(object[prop], key, acc);
    }

    return acc;
};


// filter object keys, not deeply
module.exports.filterKeys = function (obj, predicate) {
  var res = {};
  var keys = Object.keys(obj).filter(predicate).forEach(function (e) {
    res[e] = obj[e];
  });

  return res;
};

// map object keys, not deeply
module.exports.mapKeys = function (obj, mapƒ) {
  var res = {};
  var keys = Object.keys(obj);

  keys.forEach(function(e) {
    var newKey = mapƒ(e);
    res[newKey] = obj[e];
  });

  return res;
};
