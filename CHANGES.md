## 0.3.0 10/XX/2014

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
