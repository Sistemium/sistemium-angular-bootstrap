'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});
var conf = require('./conf');
var runSequence = require('run-sequence');
var path = require('path');

gulp.task('concat', function () {
  var src = conf.files.sourceFiles.concat([path.join(conf.paths.tmp, '/partials/templateCacheHtml.js')]);
  return gulp.src(src)
    .pipe($.plumber())
    .pipe($.concat('sistemium-angular-bootstrap.js'))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
    // .pipe($.uglify())
    // .pipe($.rename('sistemium-angular-bootstrap.min.js'))
    .pipe(gulp.dest(conf.paths.dist));
});

gulp.task('html', ['partials'], function () {

  return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('partials', ['markups'], function () {
  return gulp.src([
      path.join(conf.paths.tmp, '/**/*.html')
    ])
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'sistemiumBootstrap',
      root: '',
      moduleSystem: 'IIFE'
    }))
    .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
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
  runSequence(
    ['jshint', 'fonts', 'styles', 'html'],
    'concat',
    done);
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
