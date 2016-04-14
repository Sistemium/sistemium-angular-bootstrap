'use strict';

/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

var gutil = require('gulp-util');
var path = require('path');

/**
 *  The main paths of your project handle these with care
 */

var rootDirectory = path.resolve('./');
var paths = exports.paths = {
  rootDirectory: rootDirectory,
  sourceDirectory: path.join(rootDirectory, './src'),
  testDirectory: path.join(rootDirectory, './test/unit'),
  dist: path.join(rootDirectory, './dist'),
  tmp: path.join(rootDirectory, './tmp')
};

var sourceFiles = [
  // Make sure module files are handled first
  path.join(paths.sourceDirectory, '/**/*.module.js'),
  // Then add all JavaScript files
  path.join(paths.sourceDirectory, '/**/*.js')
];
exports.files = {
  sourceFiles: sourceFiles,
  styleFiles: [
    path.join(paths.sourceDirectory, '/sistemium-angular-bootstrap/styles/*.scss'),
    path.join('!' + paths.sourceDirectory, '/sistemium-angular-bootstrap/index.scss')
  ],
  lintFiles: [
    'gulpfile.js',
    // Karma configuration
    'karma-*.conf.js'
  ].concat(sourceFiles)
};

/**
 *  Wiredep is the lib which inject bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
exports.wiredep = {
  exclude: [/jquery/, /\/bootstrap\.js$/, /\/bootstrap-sass\/.*\.js/, /\/bootstrap\.css/],
  directory: 'bower_components'
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function(title) {
  'use strict';

  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
