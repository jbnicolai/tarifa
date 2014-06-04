var Q = require('q'),
    inquirer = require('inquirer'),
    cordova = require('cordova'),
    fs = require('fs'),
    path = require('path'),
    argsHelper = require('../../lib/args');

function create(argv) {

    if(argsHelper.matchSingleOptions(argv, 'h', 'help')){
        console.log(fs.readFileSync(path.join(__dirname, 'usage.txt'), 'utf-8'));
        process.exit(0);
    }

    // TODO parse arguments -> if ok -> createProject, if no args -> inquirer, if invalid args -> error + help

    // hier, we want to create a cordova project and setting up our information require to templatize it...

    /*inquirer.prompt([{
        type:'input',
        name:'project name',
        message:'what\'s the name of your project ?'
    }], function( answers ) {
        console.log(answers);
    });*/

    /*cordova.create('.', this.appId, this.appName, cfg, function (err) {
        if(err) {
            console.log(chalk.red('Error in cordova app init'));
            console.log(err);
            process.exit(1);
        }
        this.log.write().ok('Raw app created');
        cb();
    }.bind(this));*/

    return Q.resolve("ohh yessssss");
};

module.exports = create;
