var Q = require('q'),
    spinner = require('char-spinner'),
    fs = require('q-io/fs'),
    path = require('path'),
    ask = require('../../lib/questions/ask'),
    argsHelper = require('../../lib/helper/args'),
    print = require('../../lib/helper/print'),

    mainQuestions = [
        'path',
        'id',
        'name',
        'description',
        'author_name',
        'author_email',
        'author_href',
        'platforms',
        'plugins',
        'www',
        'color',
        'deploy'
    ],

    deployQuestions = [
        'deploy/ios/apple_id',
        'deploy/ios/apple_password',
        'deploy/ios/has_apple_developer_team',
        'deploy/ios/adhoc_apple_developer_identity',
        'deploy/ios/adhoc_provisioning_profile_name',
        'deploy/ios/store_apple_developer_identity',
        'deploy/ios/store_provisioning_profile_name',
        'deploy/wp8/wp8_certificate_path'
    ],

    shallReuseKeystore = [
        'deploy/android/keystore_reuse'
    ],

    reuseKeystoreQuestions = [
        'deploy/android/keystore_path_existing',
        'deploy/android/keystore_storepass',
        'deploy/android/keystore_alias_list'
    ],

    createKeystoreQuestions = [
        'deploy/android/keystore_path_non_existing',
        'deploy/android/keystore_storepass',
        'deploy/android/keystore_alias',
        'deploy/android/keystore_keypass'
    ],

    isHockeyApp = [
        'hockeyapp'
    ],

    hockeyAppQuestions = [
        'hockeyapp/token'
    ],

    tasks = [
        './tasks/tarifa',
        './tasks/cordova',
        './tasks/platforms',
        './tasks/fetch-provisioning-file',
        './tasks/create-keystore',
        './tasks/tarifa-file',
        './tasks/git',
        './tasks/plugins',
        './tasks/assets'
    ];

function launchTasks(resp) {
    return tasks.map(function (task) {
        return require(task);
    }).reduce(function (val, task) {
        return Q.when(val, task);
    }, resp);
}

function create(verbose) {
    if (verbose) print.banner();
    var response = { options : { verbose : verbose } };
    return ask(mainQuestions)(response).then(function (resp) {
        if (!resp.deploy) return resp;
        return ask(deployQuestions)(resp)
            .then(ask(shallReuseKeystore))
            .then(function (resp) {
                var nextQuestions = resp.keystore_reuse ? reuseKeystoreQuestions :
                                                          createKeystoreQuestions;
                return ask(nextQuestions)(resp);
            });
    })
    .then(ask(isHockeyApp))
    .then(function (resp) {
        if (resp.hockeyapp) return ask(hockeyAppQuestions)(resp);
        else return resp;
    })
    .then(function (resp) {
        print();
        spinner();
        return launchTasks(resp);
    });
}

function action(argv) {
    var helpPath = path.join(__dirname, 'usage.txt');

    if (argsHelper.matchArgumentsCount(argv, [0]) &&
        argsHelper.checkValidOptions(argv, ['V', 'verbose'])) {
        return create(argsHelper.matchOption(argv, 'V', 'verbose'));
    }

    return fs.read(helpPath).then(print);
}

action.launchTasks = launchTasks;
module.exports = action;
