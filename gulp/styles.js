var gulp = require('gulp');
var wiredep = require('wiredep').stream;
var $ = require('gulp-load-plugins')();
var _ = require('lodash');
var conf = require('./conf');
var path = require('path');

var buildStyles = function() {
  var sassOptions = {
    style: 'expanded'
  };

  var injectFiles = gulp.src(conf.files.styleFiles, { read: false });

  var injectOptions = {
    transform: function(filePath) {
      filePath = filePath.replace(conf.paths.sourceDirectory + '/sistemium-angular-bootstrap/', '');
      return '@import "' + filePath + '";';
    },
    starttag: '// injector',
    endtag: '// endinjector',
    addRootSlash: false
  };

  return gulp.src([
      path.join(conf.paths.sourceDirectory, '/sistemium-angular-bootstrap/index.scss')
    ])
    .pipe($.inject(injectFiles, injectOptions))
    .pipe($.replace('../../bower_components/bootstrap-sass/assets/fonts/bootstrap/', 'fonts/bootstrap/'))
    .pipe(wiredep(_.extend({}, {
      exclude: [/jquery/, /\/bootstrap\.js$/, /\/bootstrap-sass\/.*\.js/, /\/bootstrap\.css/],
      directory: 'bower_components'
    })))
    .pipe($.sass(sassOptions)).on('error', $.sass.logError)
    .pipe($.rename('sistemium-angular-bootstrap.css'))
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
};

/**
 * Styles
 */
gulp.task('styles', function() {
  return buildStyles();
});
