var gulp = require('gulp');
var config = require('../config/style');
var browserSync = require('browser-sync');

gulp.task('styles', function() {
  return gulp.src(config.cssSrc)
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream:true}));
});
