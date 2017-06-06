/**
 * @file 需要拷贝的其他文件
 */

var base = require('./');

var config = {
  src: [
    base.totalSourceDirectory + '/robots.txt',
    base.totalSourceDirectory + '/favicon.ico',
    base.totalSourceDirectory + '/server'
  ],
  dest: base.publicDirectory
};

module.exports = config;