tarifa [![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges)
======

Your friendly mobile app development toolchain on top of Cordova


### Requirements

* [Android SDK](http://developer.android.com/)
* [iOS SDK](http://developer.apple.com/)
* [nomad cli: cupertino](https://github.com/nomad/cupertino)
* [ImageMagick](http://www.imagemagick.org/)

### Install

```
npm install tarifa
```

### Usage

```
Usage: tarifa [command] [options]

Commands:

    create         Create a tarifa project
    prepare        Prepare the www project with a given platform and configuration
    platform       Manage current project platforms
    build          Build the project for a given platform and configuration
    run            Run the project for a given platform and configuration on your device
    info           Get information about the current project
    config         Configure the current project
    clean          Clean the given platform

Options:

    --version, -v  Show tarifa version number
    --help, -h     Show this message
```

### Install for developement

```
git clone https://github.com/peutetre/tarifa.git && cd tarifa && npm link .
```
