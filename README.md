tarifa [![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges)
======

*Your friendly mobile app development toolchain on top of Cordova*

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

## License

tarifa is licensed under Apache version 2.0

## Sponsors

* [zengularity](http://zengularity.com)
