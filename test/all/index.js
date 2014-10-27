switch(process.platform) {
    case 'linux':
        require('./linux')({ run: true });
        break;
    case 'win32':
        require('./win32')({ run: true });
        break;
    case 'darwin':
        require('./darwin')({ run: true });
        break;
}
