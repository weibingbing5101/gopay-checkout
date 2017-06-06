/**
 * @file 监听task
 */
var watch = require('gulp-watch');
var gulp = require('gulp');
var jsSrc = require('../config/js').watch;
var viewSrc = require('../config/view').src;
var styleSrc = require('../config/style').cssSrc;
var imgSrc = require('../config/image').src;
var copySrc = require('../config/copy').src;
var htmlSrc = require('../config/html').src;

gulp.task('watch', function() {
  watch(jsSrc, function() {
    gulp.start('js:dev')
  });
  watch(viewSrc, function() {
    gulp.start('views')
  });
  watch(styleSrc, function() {
    gulp.start('styles')
  });
  watch(imgSrc, function() {
    gulp.start('images')
  });
  watch(copySrc, function() {
    gulp.start('copy')
  });
  watch(htmlSrc, function() {
    gulp.start('html:sit')
  });
});
