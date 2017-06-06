/**
 * @file sit环境任务
 */

var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');

gulp.task('sit', function(cb) {
  process.env.NODE_ENV = 'sit';
  gulpSequence(['clean'], 'js:sit', ['views', 'styles', 'images', 'copy'], ['html:sit'], ['webpack'], cb);
});
