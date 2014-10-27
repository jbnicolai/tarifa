switch(process.platform) {
    case 'linux':
        require('./linux')({ run: false });
        break;
    case 'win32':
        require('./win32')({ run: false });
        break;
    case 'darwin':
        require('./darwin')({ run: false });
        break;
}
