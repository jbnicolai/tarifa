switch(process.platform) {
    case 'linux':
        require('./linux');
        break;
    case 'win32':
        require('./win32');
        break;
    case 'darwin':
        require('./darwin');
        break;
}
