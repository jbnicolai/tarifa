function countOptions(args){
    var i=0;
    for(var prop in args) {
        if(args.hasOwnProperty(prop)) i++;
    }
    return i;
}

function matchSingleOption(args, s, l) {
    return matchOption(args, s, l) && countOptions(args) === 2;
}

function matchSingleOptionWithArguments(args, s, l, allowedNumbers) {
    return matchOption(args, s, l) && countOptions(args) === 2 && allowedNumbers.indexOf(args._.length) > -1;
}

function matchArgumentsCount(args, allowedNumbers) {
    return allowedNumbers.indexOf(args._.length) > -1;
}

function matchOption(args, s, l) {
    return args[s] == true || args[l] == true;
}

function checkValidOptions(args, optionNames) {
    for(var prop in args) {
        if(prop !== '_' && optionNames.indexOf(prop) < 0) return false;
    }
    return true;
}

exports.matchSingleOption = matchSingleOption;
exports.matchOption = matchOption;
exports.countOptions = countOptions;
exports.matchArgumentsCount = matchArgumentsCount;
exports.matchSingleOptionWithArguments = matchSingleOptionWithArguments;
exports.checkValidOptions = checkValidOptions;