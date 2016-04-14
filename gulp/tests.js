var gulp = require('gulp');
var karma = require('karma').server;
var path = require('path');
var conf = require('./conf');

/**
 * Run test once and exit
 */
gulp.task('test-src', function (done) {
  karma.start({
    configFile:  path.join(conf.paths.rootDirectory, '/karma-src.conf.js'),
    singleRun: true
  }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-concatenated', function (done) {
  karma.start({
    configFile: path.join(conf.paths.rootDirectory, '/karma-dist-concatenated.conf.js'),
    singleRun: true
  }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-minified', function (done) {
  karma.start({
    configFile: path.join(conf.paths.rootDirectory, '/karma-dist-minified.conf.js'),
    singleRun: true
  }, done);
});
