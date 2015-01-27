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
        'deploy/deploy',
        'deploy/ios/apple_id',
        'deploy/ios/apple_password',
        'deploy/ios/has_apple_developer_team',
        'deploy/ios/adhoc_apple_developer_identity',
        'deploy/ios/adhoc_provisioning_profile_name',
        'deploy/ios/store_apple_developer_identity',
        'deploy/ios/store_provisioning_profile_name',
        'deploy/wp8/wp8_certificate_path',
        'deploy/android/keystore_reuse',
        'deploy/android/keystore_path_existing',
        'deploy/android/keystore_path_non_existing',
        'deploy/android/keystore_storepass',
        'deploy/android/keystore_alias_list',
        'deploy/android/keystore_alias',
        'deploy/android/keystore_keypass',
        'hockeyapp/hockeyapp',
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
    return tasks.map(require).reduce(Q.when, resp);
}

function create(verbose) {
    if (verbose) print.banner();
    var response = { options : { verbose : verbose } };
    return ask(mainQuestions)(response).then(function (resp) {
        print(); spinner();
        return launchTasks(resp);
    });
}

create.launchTasks = launchTasks;
module.exports = create;
