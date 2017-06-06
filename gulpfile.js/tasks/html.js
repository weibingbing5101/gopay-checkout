/**
 * @file html的task 主要给引用的资源后面加入md5
 */
var gulp = require('gulp');
var config = require('../config/html');
var preprocess = require('gulp-preprocess');
var browserSync = require('browser-sync');
var rename = require("gulp-rename");

gulp.task('html:sit', function() {
  return gulp.src(config.src)
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('html:prod', function() {
  return gulp.src(config.src)
    .pipe(preprocess({context: { NODE_ENV: 'prod' }}))
    .pipe(gulp.dest(config.dest));
});

gulp.task('html:sandbox', function() {
  return gulp.src(config.src)
    .pipe(preprocess({context: { NODE_ENV: 'sandbox' }}))
    .pipe(gulp.dest(config.dest));
});
