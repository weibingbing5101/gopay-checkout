/**
 * @file 上线环境任务
 */

var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');

gulp.task('prod', function(cb) {
  process.env.NODE_ENV = 'prod';
  gulpSequence('clean',  ['views', 'styles', 'images', 'copy', 'copy:server'], ['html:prod'], ['webpack'], cb);
});