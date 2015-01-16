module.exports.beforeCompile = function (conf, options) {
    process.env.ANDROID_BUILD = 'gradle';
    return options;
};

/* tasks definition */
module.exports.tasks = {
    'clean-resources': [
        'lib/platforms/android/actions/build/tasks/clean_output_dir',
    ],
    'pre-cordova-prepare' : [
        'lib/platforms/shared/actions/build/tasks/populate_config_xml',
        'lib/platforms/shared/actions/build/tasks/copy_icons',
        'lib/platforms/shared/actions/build/tasks/copy_splashscreens',
        'lib/platforms/android/actions/build/tasks/change_template_activity',
        'lib/platforms/android/actions/build/tasks/release-properties'
    ],
    'pre-cordova-compile' : [
        'lib/platforms/android/actions/build/tasks/app_label'
    ],
    'post-cordova-compile' : [
        'lib/platforms/android/actions/build/tasks/copy_apk'
    ],
    'undo':[
        'lib/platforms/shared/actions/build/tasks/reset_config_xml',
        'lib/platforms/android/actions/build/tasks/reset_config_xml',
        'lib/platforms/android/actions/build/tasks/reset_template_activity',
        'lib/platforms/android/actions/build/tasks/reset_app_label',
        'lib/platforms/android/actions/build/tasks/reset_release_properties'
    ]
};
