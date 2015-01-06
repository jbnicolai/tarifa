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
        'deploy/apple_id',
        'deploy/apple_password',
        'deploy/has_apple_developer_team',
        'deploy/apple_developer_identity',
        'deploy/provisioning_profile_name',
        'deploy/wp8_certificate_path'
    ],

    shallReuseKeystore = [
        'deploy/keystore_reuse'
    ],
    reuseKeystoreQuestions = [
        'deploy/keystore_path_existing',
        'deploy/keystore_storepass',
        'deploy/keystore_alias_list'
    ],
    createKeystoreQuestions = [
        'deploy/keystore_path_non_existing',
        'deploy/keystore_storepass',
        'deploy/keystore_alias',
        'deploy/keystore_keypass'
    ],

    isHockeyApp = [
        'hockeyapp/hockeyapp'
    ],

    hockeyAppQuestions = [
        'hockeyapp/token'
    ],

    tasks = [
        require('./tasks/tarifa'),
        require('./tasks/cordova'),
        require('./tasks/platforms'),
        require('./tasks/fetch-provisioning-file'),
        require('./tasks/create-keystore'),
        require('./tasks/tarifa-file'),
        require('./tasks/git'),
        require('./tasks/plugins'),
        require('./tasks/assets')
    ];

function launchTasks(resp) {
    return tasks.reduce(function (val, task) {
        return Q.when(val, task);
    }, resp);
}

function create(verbose) {
    if (verbose) print.banner();
    return ask(mainQuestions)({ options : { verbose : verbose } })
        .then(function (resp) {
            if (!resp.deploy) return resp;
            return ask(deployQuestions)(resp)
                    .then(ask(shallReuseKeystore))
                    .then(function (resp) {
                        var nextQuestions = resp.keystore_reuse ? reuseKeystoreQuestions :
                                                                  createKeystoreQuestions;
                        return ask(nextQuestions)(resp);
                    });
        })
        .then(function (resp) {
            return ask(isHockeyApp)(resp);
        })
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
