
function matchSingleOptions(arg, s, l) {
    return (arg[s] == true || arg[l] == true) && arg.length != 2;
}

exports.matchSingleOptions = matchSingleOptions;
