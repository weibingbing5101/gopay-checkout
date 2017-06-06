/**
 * @file angular样式的配置
 */

var base = require('./');

var config = {
  cssSrc: [
    base.totalSourceDirectory + '/css/**/*.css',
    base.totalSourceDirectory + '/css/**/*.eot',
    base.totalSourceDirectory + '/css/**/*.svg',
    base.totalSourceDirectory + '/css/**/*.ttf',
    base.totalSourceDirectory + '/css/**/*.woff'
  ],
  dest: base.publicDirectory + '/css'
};

module.exports = config;