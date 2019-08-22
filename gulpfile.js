'use strict';
// gulp 4

var gulp = require('gulp'),
  watch = require('gulp-watch'),
  prefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  gcmq = require('gulp-group-css-media-queries'),
  sourcemaps = require('gulp-sourcemaps'),
  notify = require('gulp-notify'),
  del = require('del'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload;

sass.compiler = require('node-sass');

var path = {
  html: {
    src: '*.html',
    watch: '*.html'
  },
  style: {
    src: 'scss/*.scss',
    dest: 'css/',
    watch: 'scss/**/*.scss'
  }
};

var config = {
  server: {
    baseDir: './'
  },
  host: 'localhost',
  port: 9000,
  browser: ['chrome']
};

// server
function webserver() {
  return browserSync(config);
}

// html
function html() {
  return gulp.src(path.html.src)
    .pipe(reload({ stream: true }));
}

// style
function style() {
  return gulp.src(path.style.src)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compact' }).on('error', notify.onError()))
    .pipe(prefixer())
    .pipe(gcmq())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.style.dest))
    .pipe(reload({ stream: true }));
}

// watch
function devwatch() {
  watch(path.html.watch, html);
  watch(path.style.watch, style);
}

// clean
function clean() {
  return del(['css']);
}

// build
var build = gulp.series(clean, gulp.parallel(style));

// default
gulp.task('default', gulp.series(build, gulp.parallel(webserver, devwatch)));

//svg sprite
var svgSprite = require('gulp-svg-sprite');
gulp.task('svgSprite', function () {
  return gulp.src('images/icons/*.svg') //svg files for sprite
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"  //sprite file name
        }
      },
    }
    ))
    .pipe(gulp.dest('images/'));
});