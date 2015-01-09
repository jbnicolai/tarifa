var Q = require('q'),
    spinner = require('char-spinner'),
    ask = require('../../../lib/questions/ask'),
    print = require('../../../lib/helper/print'),

    mainQuestions = [
        'project/path',
        'project/id',
        'project/name',
        'project/description',
        'project/author_name',
        'project/author_email',
        'project/author_href',
        'project/platforms',
        'project/plugins',
        'project/www',
        'project/color',
        'deploy/deploy'
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
        'hockeyapp/hockeyapp'
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
        return ask(deployQuestions)(resp).then(ask(shallReuseKeystore)).then(function (resp) {
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

create.launchTasks = launchTasks;
module.exports = create;
