/**
 * @file html任务的配置
 */
var base = require('./');
var config = {
  src: base.totalSourceDirectory + '/index.html',
  dest: base.publicDirectory
}

module.exports = config;