/**
 * @file 默认task 编译态
 */
var
  /**
   * @desc gulp
   */
  gulp = require('gulp'),
  gutil = require('gulp-util'),

  /**
   * @desc 获得控制台输入的参数
   */
  minimist = require('minimist');

//初始化环境变量，根据cli传入的参数初始化构建的配置
gulp.task('initEnv', function() {
  var options = minimist(process.argv.slice(2), {
    string: [],
    default: {

    }
  });
  //TODO 收集输入的参数
});

//默认task
gulp.task('default', ['initEnv'], function() {
  return gulp.start('build:dev');
});