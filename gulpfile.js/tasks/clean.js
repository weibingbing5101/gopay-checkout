var gulp = require('gulp');
//删除文件模块
var del = require('del');
var config = require('../config');

gulp.task('clean', function(cb) {
  return del(config.publicDirectory, cb);
});