'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var pug = require('gulp-pug');

var $ = require('gulp-load-plugins')();

gulp.task('markups', function() {
  function renameToHtml(path) {
    path.extname = '.html';
  }

  return gulp.src(path.join(conf.paths.sourceDirectory, '/**/*.{jade,pug}'))
    .pipe(pug({
      basedir: conf.paths.sourceDirectory,
      pretty: true
    }))
      .on('error', conf.errorHandler('Jade'))
    .pipe($.rename(renameToHtml))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/')))
});
