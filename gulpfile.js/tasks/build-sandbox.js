/**
 * @file 沙箱环境任务
 */

var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');

gulp.task('sandbox', function(cb) {
  process.env.NODE_ENV = 'sandbox';
  gulpSequence('clean',  ['views', 'styles', 'images', 'copy', 'copy:server'], ['html:sandbox'], ['webpack'], cb);
});