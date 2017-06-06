var log4js = require('log4js');
var path = require('path');
var fs = require('fs');

var logDir = path.join(__dirname, '../../logs'),
    errorLogPath = path.join(logDir, 'error.log'),
    infoLogPath = path.join(logDir, 'info.log');

if(!fs.existsSync(logDir)){
  fs.mkdirSync(logDir);
}
if(!fs.existsSync(errorLogPath)){
  fs.writeFileSync(errorLogPath);
}
if(!fs.existsSync(infoLogPath)){
  fs.writeFileSync(infoLogPath);
}



log4js.configure({

  appenders: [
    { type: 'console' }, //控制台输出
    {
      type: 'file', //文件输出
      filename: errorLogPath, 
      maxLogSize: 1024*1024,
      pattern: "%[%r (%x{pid}) %p %c -%] %m%n",
      backups:10,
      category: 'error' 
    },
    {
      type: 'file', //文件输出
      filename: infoLogPath, 
      maxLogSize: 1024*1024*1024,
      pattern: "%[%r (%x{pid}) %p %c -%] %m%n",
      backups:10,
      category: 'info' 
    }
  ],
  replaceConsole: true
});
var errorLogger = log4js.getLogger('error'),
    infoLogger = log4js.getLogger('info');

errorLogger.setLevel('ERROR');
infoLogger.setLevel('INFO');

exports.error = function(){
  errorLogger.error(Array.prototype.slice.call(arguments).join(" "));
}
exports.info = function(){
  infoLogger.info(Array.prototype.slice.call(arguments).join(" "));
}
exports.log = function(){
  infoLogger.info(Array.prototype.slice.call(arguments).join(" "));
}