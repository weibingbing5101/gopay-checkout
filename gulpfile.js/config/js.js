/**
 * @file js任务用到的配置
 */

var base = require('./');

var jsSrc = [
    base.totalSourceDirectory + '/lib/angular.js',
    base.totalSourceDirectory + '/lib/angular-animate.js',
    base.totalSourceDirectory + '/lib/angular-cookies.js',
    base.totalSourceDirectory + '/lib/angular-resource.js',
    base.totalSourceDirectory + '/lib/angular-route.js',
    base.totalSourceDirectory + '/lib/angular-sanitize.js',
    base.totalSourceDirectory + '/lib/angular-touch.js',
    base.totalSourceDirectory + '/jscommon/angular-carousel.js',
    base.totalSourceDirectory + '/jscommon/carousel.js',
    base.totalSourceDirectory + '/jscommon/tools.js',
    base.totalSourceDirectory + '/jscommon/filter.js',
    base.totalSourceDirectory + '/jscommon/app.js',
    base.totalSourceDirectory + '/scripts/**/*.js'
  ],
  //TODO 路径应该是动态算出来的
  sitSrc = jsSrc.concat([base.totalSourceDirectory + '/jscommon/const.js']),
  devSrc = jsSrc.concat([base.totalSourceDirectory + '/jscommon/const.js']),
  testSrc = jsSrc.concat([base.totalSourceDirectory + '/jscommon/const.test.js']),
  src = jsSrc.concat(base.totalSourceDirectory + '/jscommon/const.pre.js');

var config = {
  siteSrc: sitSrc,
  devSrc: devSrc,
	testSrc: testSrc,
  src: src,
  dest: base.publicDirectory + '/js',
  watch: base.totalSourceDirectory + '/**/*.js'
};

module.exports = config;