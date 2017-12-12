const gulp = require('gulp');

const browserSync = require('browser-sync').create();

const sourcemaps = require('gulp-sourcemaps');

const sass = require('gulp-sass');

// use the latest css syntax
const postcss = require('gulp-postcss');
const cssnext = require('postcss-cssnext');

// minify css styles
const cleanCSS = require('gulp-clean-css');

// minify javascript
const uglify = require('gulp-uglify');
const pump = require('pump');

// umd
const umd = require('gulp-umd');

// static asset revisioning by appending content hash to filenames
const rev = require('gulp-rev');

///////////////////////////////////////////////
/*              npm run dev                  */
///////////////////////////////////////////////
gulp.task('dev', ['sass', 'js'], function() {
  browserSync.init({
    server: './'
  });

  gulp.watch('scss/**/*.scss', ['sass']);
  gulp.watch('js/**/*.js', ['js']);
  gulp.watch('index.html').on('change', browserSync.reload);
});

gulp.task('sass', function() {
  return gulp
    .src('scss/**/*.scss')
    .pipe(sass())
    .pipe(postcss([cssnext()]))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {
  return gulp.src('src/**/*.js').pipe(browserSync.stream());
});

///////////////////////////////////////////////
/*              npm run build                */
///////////////////////////////////////////////
gulp.task('build', ['sass-prod', 'js-prod'], function() {});

gulp.task('sass-prod', function() {
  return gulp
    .src('scss/**/*.scss')
    .pipe(sass())
    .pipe(sourcemaps.init())
    .pipe(postcss([cssnext()]))
    .pipe(
      cleanCSS({
        compatibility: 'ie8'
      })
    )
    .pipe(rev())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('libs'));
});

gulp.task('js-prod', function(cb) {
  pump(
    [
      gulp.src('src/**/*.js'),
      sourcemaps.init(),
      uglify(),
      umd(),
      rev(),
      sourcemaps.write('.'),
      gulp.dest('libs')
    ],
    cb
  );
});
