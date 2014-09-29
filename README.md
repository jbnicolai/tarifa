tarifa [![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges)
======

<a href="http://tarifa.tools">
    <img src="./template/assets/logo.png" width="100px" align="center" alt="tarifa logo" />
</a>

*Your friendly mobile app development toolchain based on Cordova*

tarifa is a CLI on top of [cordova](http://cordova.apache.org/).
It aims at simplifying the cordova workflow and adding features to complete the cordova toolchain such as:

* **multiple configurations**: simply produce multiple unique apps on a given platform within a single project.
* **integration of any www build process**: integrate any www build process in the cordova workflow.
* **interactive project bootstrap**: no need to remember every required information when creating a project, tarifa
asks questions and validates user input.
* **deployment to hockeyapp from the terminal**: no need to launch a browser to upload a binary file to hockeyapp, tarifa handles it.

### Requirements

| sdk/os                                     | macosx | linux | win32 |
| -------------------------------------------|:------:|:-----:|:-----:|
| [ios](http://developer.apple.com/)         | ✔      | ✗     | ✗     |
| [android](http://developer.android.com/)   | ✔      | ✔     | ✔     |
| windows phone                              | ✗      | ✗     | ✔     |
| windows8                                   | ✗      | ✗     | ✔     |

* [nomad cli: cupertino](https://github.com/nomad/cupertino) (only for ios)
* [ImageMagick](http://www.imagemagick.org/)

### Documentation

Documentation can be read on [tarifa-book](https://www.gitbook.io/content/book/42loops/tarifa/index.html).

### Install

```
npm install tarifa -g
```

Some optional dependencies should failed depending on your os
(like, cordova-deploy-windows-phone fails to install on linux or mac os x).

### Usage

```
Usage: tarifa [command] [options]

Commands:

    create         Create a tarifa project
    prepare        Prepare the www project with a given platform and configuration
    platform       Manage current project platforms
    plugin         Add, remove or list cordova plugins in your project
    build          Build the project for a given platform and configuration
    run            Run the project for a given platform and configuration on your device
    info           Get some informations about your environment and your devices
    config         Configure the current project
    check          Check the current project after cloning
    clean          Clean the given platform
    hockeyapp      Interface with hockeyapp beta testing platform

Options:

    --version, -v  Show tarifa version number
    --verbose, -V  Add verbosity to commands
    --help, -h     Show this message
```

### Install for developement

```
git clone https://github.com/peutetre/tarifa.git && cd tarifa && npm link .
```

### Tests

Only testing xml files changes

```
npm test
```

## License

tarifa is licensed under Apache version 2.0

## Sponsors

* [zengularity](http://zengularity.com)
