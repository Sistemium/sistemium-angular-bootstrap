'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var conf = require('./conf');
var path = require('path');

gulp.task('doc', function (done) {

  gulp.src([path.join(conf.paths.rootDirectory, '/README.md'), path.join(conf.paths.sourceDirectory, './**/*.js')], {read: false})
    .pipe($.jsdoc3(done));

});

gulp.task('angular-jsdoc',

  $.shell.task([
      'node_modules/jsdoc/jsdoc.js ' +
      '-c node_modules/angular-jsdoc/common/conf.json ' +   // config file
      '-t node_modules/angular-jsdoc/angular-template ' +   // template file
      '-d dist/docs ' +                           // output directory
      './README.md ' +                            // to include README.md as index contents
      '-r src/sistemium-angular-bootstrap/directives'                 // source code directory
    ]
  )
);
