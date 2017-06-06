/**
 * @file js任务用到的配置
 */

var base = require('./');

var jsSrc = [
  base.totalSourceDirectory + '/jscommon/angular-carousel.js',
  base.totalSourceDirectory + '/jscommon/carousel.js',
  base.totalSourceDirectory + '/jscommon/tools.js',
  base.totalSourceDirectory + '/jscommon/filter.js',
  base.totalSourceDirectory + '/jscommon/app.js',
  base.totalSourceDirectory + '/scripts/**/*.js'
]

sitSrc = jsSrc.concat([base.totalSourceDirectory + '/jscommon/const.js']),
devSrc = jsSrc.concat([base.totalSourceDirectory + '/jscommon/const.js']),
src = jsSrc.concat(base.totalSourceDirectory + '/jscommon/const.pre.js');

var config = {
  siteSrc: sitSrc,
  devSrc: devSrc,
  src: src,
  dest: base.publicDirectory + '/js',
  lintrc: base.totalSourceDirectory + '/.eslintrc'
};

module.exports = config;