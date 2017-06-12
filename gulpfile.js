const gulp = require('gulp');
const path = require('path');
const scp = require('gulp-scp2');
const replace = require('gulp-replace-task');

gulp.task('replace', function() {
  gulp.src(['dist/**/*'])
    .pipe(replace({
            patterns: [
              {
                match: new RegExp('http://localhost:3000', "g"),
                replacement: function() {
                  return `http://${process.argv[2]}:3000`;
                }
              },
              {
                match: new RegExp('/static/', "g"),
                replacement: function() {
                  return '/libreplay/static/'
                }
              }
            ]
          }))
    .pipe(gulp.dest('client/dist/'));
});

gulp.task('copy', function() {
  return gulp.src(['client/dist/**/*.*'])
  .pipe(scp({
    host: process.argv[2],
    username: process.argv[3],
    password: process.argv[4],
    dest: process.argv[5]
  }))
  .on('error', function(err) {
    console.log(err);
  });
});
