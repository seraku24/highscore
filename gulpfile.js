const CI = process.env.CI === 'true';

const gulp = require('gulp'),
      mocha = require('gulp-mocha'),
      watch = require('gulp-watch'),
      batch = require('gulp-batch');

const sources = ['index.js', './lib/**/*.js'],
      tests = ['./test/**/*.test.js'];

gulp.task('test', () =>
  gulp.src(tests, { read: false })
    .pipe(mocha({
      require: ['./test/setup.js'],
      reporter: CI ? 'spec' : 'nyan'
    }))
);

gulp.task('watch', function() {
  watch(sources.concat(tests), batch(function (events, done) {
    gulp.start('test', done);
  }));
});
