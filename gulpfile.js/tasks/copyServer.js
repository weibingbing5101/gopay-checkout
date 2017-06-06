/**
 * @file TODO 额外的文件的拷贝 没啥用
 */
var gulp = require('gulp');
var config = require('../config/copyServer');

gulp.task('copy:server', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest));
});