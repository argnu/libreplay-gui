const gulp = require('gulp');
const path = require('path');
const scp = require('gulp-scp2');
const replace = require('gulp-replace-task');
const argv = require('minimist')(process.argv.slice(2));

gulp.task('replace', function() {
  gulp.src(['dist/**/*'])
    .pipe(replace({
            patterns: [
              {
                match: new RegExp('http://localhost:3000', "g"),
                replacement: function() {
                  return `http://${argv.h}`;
                }
              },
              {
                match: new RegExp('/static/', "g"),
                replacement: function() {
                  return `/argv.f/static/`
                }
              }
            ]
          }))
    .pipe(gulp.dest('dist/'));
});
