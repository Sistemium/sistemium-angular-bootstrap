'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});
var conf = require('./conf');
var runSequence = require('run-sequence');
var path = require('path');

gulp.task('build', function() {
  return gulp.src(conf.files.sourceFiles)
    .pipe($.plumber())
    .pipe($.concat('sistemium-angular-bootstrap.js'))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    .pipe($.uglify())
    .pipe($.rename('sistemium-angular-bootstrap.min.js'))
    .pipe(gulp.dest(conf.paths.dist));
});

/**
 * Fonts
 */
gulp.task('fonts', function () {
  return gulp.src('./bower_components/bootstrap-sass/assets/fonts/**/*.*')
    .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts')));
});

/**
 * Process
 */
gulp.task('process-all', function (done) {
  runSequence('jshint', 'test-src', 'fonts', 'styles', 'build', done);
});

/**
 * Validate source JavaScript
 */
gulp.task('jshint', function () {
  return gulp.src(conf.files.lintFiles)
    .pipe($.plumber())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('clean', function () {
  return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
});
