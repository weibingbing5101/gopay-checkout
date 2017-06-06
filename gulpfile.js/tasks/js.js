/**
 * @file 处理javascript的task
 */

var config = require('../config/js');
var gulp = require('gulp');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var stripDebug = require('gulp-strip-debug');
var handleErrors = require('../lib/error');
var ngAnnotate = require('gulp-ng-annotate');
var browserSync = require('browser-sync');

gulp.task('js:dev', ['js:copy'], function() {
  return gulp.src(config.devSrc)
    .on('error', handleErrors)
    .pipe(sourcemaps.init())
    .pipe(concat('ffan-m.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('js:sit', ['js:copy'], function() {
  return gulp.src(config.siteSrc)
    .pipe(sourcemaps.init())
    .pipe(concat('ffan-m.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.dest));
});

gulp.task('js:prod', ['js:copy'], function() {
  return gulp.src(config.src)
    .pipe(concat('ffan-m.js'))
    .pipe(ngAnnotate())
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest(config.dest));
});

gulp.task('js:test', ['js:copy'], function() {
  return gulp.src(config.testSrc)
    .pipe(sourcemaps.init())
    .pipe(concat('ffan-m.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.dest));
});

gulp.task('js:copy', function() {
    return gulp.src('./app/jscommon/*.js')
        .pipe(gulp.dest('./dist/jscommon/'));
});


