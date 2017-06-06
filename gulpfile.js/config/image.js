/**
 * @file angular图片的配置
 */

var base = require('./');

var config = {
  src: [
    base.totalSourceDirectory + '/images/**/*.png',
    base.totalSourceDirectory + '/images/**/*.gif',
    base.totalSourceDirectory + '/images/**/*.jpg',
  ],
  dest: base.publicDirectory + '/images'
};

module.exports = config;