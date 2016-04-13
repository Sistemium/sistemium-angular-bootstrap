var gulp = require('gulp');
var karma = require('karma').server;
var path = require('path');
var runSequence = require('run-sequence');
var wiredep = require('wiredep').stream;
var $ = require('gulp-load-plugins')();
var _ = require('lodash');

/**
 * File patterns
 **/

// Root directory
var rootDirectory = path.resolve('./');

// Source directory for build process
var sourceDirectory = path.join(rootDirectory, './src');

// tests
var testDirectory = path.join(rootDirectory, './test/unit');

var sourceFiles = [

  // Make sure module files are handled first
  path.join(sourceDirectory, '/**/*.module.js'),

  // Then add all JavaScript files
  path.join(sourceDirectory, '/**/*.js')
];

var styleFiles = [
  path.join(sourceDirectory, '/sistemium-angular-bootstrap/styles/*.scss'),
  path.join('!' + sourceDirectory, '/sistemium-angular-bootstrap/index.scss')
];

var lintFiles = [
  'gulpfile.js',
  // Karma configuration
  'karma-*.conf.js'
].concat(sourceFiles);

var buildStyles = function() {
  var sassOptions = {
    style: 'expanded'
  };

  var injectFiles = gulp.src(styleFiles, { read: false });

  var injectOptions = {
    transform: function(filePath) {
      filePath = filePath.replace(sourceDirectory + '/sistemium-angular-bootstrap/', '');
      return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  return gulp.src([
      path.join(sourceDirectory, '/sistemium-angular-bootstrap/index.scss')
    ])
    .pipe($.inject(injectFiles, injectOptions))
    .pipe(wiredep(_.extend({}, {
      exclude: [/jquery/, /\/bootstrap\.js$/, /\/bootstrap-sass\/.*\.js/, /\/bootstrap\.css/],
      directory: 'bower_components'
    })))
    .pipe($.sass(sassOptions)).on('error', $.sass.logError)
    .pipe($.rename('sistemium-angular-bootstrap.css'))
    .pipe(gulp.dest('./dist'));
};

gulp.task('styles', function() {
  return buildStyles();
});

gulp.task('build', function() {
  gulp.src(sourceFiles)
    .pipe($.plumber())
    .pipe($.concat('sistemium-angular-bootstrap.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe($.uglify())
    .pipe($.rename('sistemium-angular-bootstrap.min.js'))
    .pipe(gulp.dest('./dist'));
});

/**
 * Process
 */
gulp.task('process-all', function (done) {
  runSequence('jshint', 'test-src', 'styles', 'build', done);
});

/**
 * Watch task
 */
gulp.task('watch', function () {

  // Watch JavaScript files
  gulp.watch([sourceFiles, styleFiles], ['process-all']);

  // watch test files and re-run unit tests when changed
  gulp.watch(path.join(testDirectory, '/**/*.js'), ['test-src']);
});

/**
 * Validate source JavaScript
 */
gulp.task('jshint', function () {
  return gulp.src(lintFiles)
    .pipe($.plumber())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

/**
 * Run test once and exit
 */
gulp.task('test-src', function (done) {
  karma.start({
    configFile: __dirname + '/karma-src.conf.js',
    singleRun: true
  }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-concatenated', function (done) {
  karma.start({
    configFile: __dirname + '/karma-dist-concatenated.conf.js',
    singleRun: true
  }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-minified', function (done) {
  karma.start({
    configFile: __dirname + '/karma-dist-minified.conf.js',
    singleRun: true
  }, done);
});

gulp.task('default', function () {
  runSequence('process-all', 'watch');
});
