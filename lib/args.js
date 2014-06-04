
function matchSingleOptions(arg, s, l) {
    return (arg[s] == true || arg[l] == true) && arg._.length == 0 && arg.length != 2;
}

exports.matchSingleOptions = matchSingleOptions;
