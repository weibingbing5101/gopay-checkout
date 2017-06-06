/**
 * @file sit环境任务
 */

var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');

gulp.task('test', function(cb) {
	process.env.NODE_ENV = 'test';
	gulpSequence(['clean'], 'js:test', ['views', 'styles', 'images', 'copy', 'copy:server'], ['html:sit'], ['webpack'], cb);
});
