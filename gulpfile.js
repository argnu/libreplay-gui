const gulp = require('gulp');
const path = require('path');
const scp = require('gulp-scp2');
const replace = require('gulp-replace-task');
const argv = require('minimist')(process.argv.slice(2));

gulp.task('sethost', function() {
  gulp.src(['node-server/index.js', 'dist/**/*'])
    .pipe(replace({
            patterns: [
              {
                match: new RegExp('http://localhost:3000', "g"),
                replacement: function() {
                  return `http://${argv.h}`;
                }
              },
            ]
          }))
    .pipe(gulp.dest('client/dist/'));
});
