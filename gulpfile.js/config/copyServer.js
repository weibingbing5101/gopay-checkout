/**
 * @file 需要拷贝的其他文件
 */

var base = require('./');

var config = {
  src: [
    base.totalSourceDirectory + '/server/**/*'
  ],
  dest: base.publicDirectory + '/server'
};

module.exports = config;