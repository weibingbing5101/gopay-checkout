var gulp = require('gulp');
var config = require('../config/view');
var browserSync = require('browser-sync');

gulp.task('views', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream:true}));
});