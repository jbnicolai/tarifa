## 0.5.0 (not released yet)

### upgrade a project from 0.4.0 to 0.5.0

TODO

### changes

- allow `all` keyword and configuration enumeration like `stage,prod` as command line arguments to build
or run any combination of the tuple (configuration, platform) #103
- group all signing properties under the `signing` attribute #115
- add `tarifa create plugin`: create a cordova plugin skeleton. #139
- handling of `access origin` `launch-external` attribute #158
- [ios] copy `build.xcconfig` on platform add ios #153
- [ios] add `tarifa config provisioning info <configuration>`: extract informations from a provisioning file #148
- [ios] add `tarifa config provisioning fetch`: fetch and install a provisioning file #148
- [ios] handle ios store distribution siging process #135
- [ios] check if all provisioning files defined exist on `tarifa check` #147
- [android] add `--clean-resources` option on `tarifa build` and `tarifa run`: clean android assets (`res` folder and generated apks) #162

## 0.4.0 (12/18/2014)

### upgrade a project from 0.3.x to 0.4.0

run `tarifa update --verbose` command.

### changes

- `tarifa watch`: live reload for all platforms (inspired from https://github.com/driftyco/ionic-cli)
- [wp8 company app distribution] replace `sign_mode` in `tarifa.json` with `certificate_path`
- now, we have a buildbot!: http://ci.tarifa.tools watching all repo branches
- test android, ios(ad-hoc) and wp8 signing process
- upgrade to cordova 4.1.2 (which upgrade cordova-ios@3.7.0 and cordova-wp8@3.7.0)
- updade default plugins to latest cordova plugins release: http://cordova.apache.org/news/2014/12/09/plugins-release.html
- `~` style path are now correctly handled in `tarifa create`
- allow parentheses in product name
- create a tarifa project in the current directory
- support `commit_sha`, `build_server_url` and `repository_url` options in `tarifa hockeyapp`
- do not impose what is private in tarifa.json/private.json files only on `tarifa create`
- create an `hockeyapp_id` when upload new configuration
- `tarifa create` creates android keystore if wanted

## 0.3.1 10/28/2014

- something went wrong while publishing 0.3.0 on npm: republish on npm.

## 0.3.0 10/28/2014

### upgrade a project from 0.2.5 to 0.3.0

- remove the `web` platform and the according configuration in the tarifa.json
- execute the command `tarifa update --verbose` to update cordova plugins and platforms
- execute the command `tarifa platform add browser --verbose` to add the browser platform
- in the tarifa.json file, rename the `check.web` key to `check.browser` and ensure the
corresponding value is a valid `'./project/bin/check_browser.js'` script

### changes

- update cordova-lib to 4.0.0
- replace the `web` platform with the new `browser` platform
- `tarifa info` adding current project cordova-$platform versions
- adding tests: `npm test` and `npm run all`
- www project output can be changed in any configuration with
the `project_output` attribute
- warn user if name given in tarifa file does not match the cordova project's name
- icons and splashscreens folder `images` can be overwritten with the `assets_path`
attribute in the tarifa.json file
- the cordova attribute in tarifa.json can be overwritten in any configuration
- new command `tarifa update` for updating default plugins and cordova platforms
- call tarifa in any project subdirectory
- adding a wp8 gitignore
- cleaning gradle build cache on `tarifa clean`
- update .gitignore for gradle builds
- ability to overwrite chrome path on linux and windows in user configstore yaml file
- be able to choose `all` devices on `tarifa run`
- speed up the cli by not requiring all actions on start
- support 9patch splashscreens on android
- `tarifa platform` supports following format for add action: `$platform@version`

## 0.2.5 10/09/2014

- remove postinstall scripts

## 0.2.4 10/08/2014

- fix default template project for web platform.
- fix `tarifa create` when choosing any platform.

## 0.2.3 10/08/2014

- [android] remove versionCode handling, since 3.5.0, cordova generates it from the version.

## 0.2.2 10/07/2014

- remove check for `ant` in `tarifa info`

## 0.2.1 10/06/2014

- fix tarifa plugin add/remove of plugins with dependencies.

## 0.2.0 10/06/2014

- initial release.
