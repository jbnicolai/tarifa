function countOptions(args){
    var i=0;
    for(var prop in args) {
        if(args.hasOwnProperty(prop)) i++;
    }
    return i;
}

function matchSingleOption(args, s, l) {
    return matchOption(args, s, l) && countOptions(args) === 2 && args._.length === 0;
}

function matchOption(args, s, l) {
    return args[s] == true || args[l] == true;
}

exports.matchSingleOption = matchSingleOption;
exports.matchOption = matchOption;
exports.countOptions = countOptions;
