'use strict';

require('sistemium-gulp')
  .config({
    ngModule: 'sistemiumBootstrap',
    tasks: 'lib_tasks',
    concat: 'sistemium-angular-bootstrap.js',
    styles: {
      src: 'sistemium-angular-bootstrap',
      index: 'index.scss',
      concat: 'sistemium-angular-bootstrap.css',
      replace: {
        fonts: ['../../bower_components/bootstrap-sass/assets/fonts/bootstrap/', 'fonts/bootstrap/']
      }
    },
    others: {
      sass: {
        from: './src/sistemium-angular-bootstrap/**/*.scss',
        to: '/sass',
        replaces: [
          ['src/sistemium-angular-bootstrap/styles/', ''],
          ['../bower_components/bootstrap-sass/assets/fonts', '../bower_components/sistemium-angular-bootstrap/dist/fonts'],
          ['bootstrap/_bootstrap.scss', '_bootstrap.scss'],
          ['../../../bower_components/bootstrap-sass', '../../../bootstrap-sass']
        ]
      },
      fonts: ['./bower_components/bootstrap-sass/assets/fonts/**/*.*', '/fonts/bootstrap']
    }
  })
  .lib(require('gulp'));
