/**
 * @file angular模版的配置
 */

var base = require('./');

var config = {
  src: base.totalSourceDirectory + '/view/**/*',
  dest: base.publicDirectory + '/view'
};

module.exports = config;