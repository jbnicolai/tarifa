
function matchSingleOptions(arg, s, l, arr) {
    var arr = arr || [ 0 ];
    return (arg[s] == true || arg[l] == true) && (arr.indexOf(arg._.length) >= 0) && arg.length != 2;
}

exports.matchSingleOptions = matchSingleOptions;
