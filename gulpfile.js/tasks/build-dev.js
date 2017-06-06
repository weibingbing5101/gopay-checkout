/**
 * @file sit环境任务
 */

var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');

gulp.task('build:dev', function(cb) {
  process.env.NODE_ENV = 'dev';
  gulpSequence(['clean'], 'js:dev', ['views', 'styles', 'images', 'copy'], ['html:sit'], ['watch', 'browserSync'], cb);
});