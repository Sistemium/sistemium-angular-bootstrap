var gulp = require('gulp');
var path = require('path');
var conf = require('./conf');

/**
 * Watch task
 */
gulp.task('watch', function () {

  // Watch JavaScript files
  gulp.watch([conf.files.sourceFiles, conf.files.styleFiles, conf.files.pugFiles], ['process-all']);

  // watch test files and re-run unit tests when changed
  gulp.watch(path.join(conf.paths.testDirectory, '/**/*.js'), ['test-src']);
});




