var Q = require('q');

module.exports = function (msg) {
    // TODO
    // only on release mode: for entreprise deployement
    // exec "c:\Program Files (x86)\Microsoft SDKs\Windows Phone\v8.0\Tools\XapSignTool\XapSignTool.exe" sign /v myapp\app\platforms\wp8\Bin\Release\mypackage.app.xap
    return Q.resolve(msg);
};