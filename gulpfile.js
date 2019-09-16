'use strict';
// gulp 4

var { src, dest, task, series, parallel } = require('gulp'),
  watch = require('gulp-watch'),
  prefixer = require('gulp-autoprefixer'),
  sass = require('gulp-sass'),
  gcmq = require('gulp-group-css-media-queries'),
  // sourcemaps = require('gulp-sourcemaps'),
  rigger = require('gulp-rigger'),
  cssmin = require('gulp-csso'),
  rename = require('gulp-rename'),
  minify = require('gulp-minify'),
  imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
  notify = require('gulp-notify'),
  del = require('del'),
  browserSync = require('browser-sync'),
  reload = browserSync.reload;

sass.compiler = require('node-sass');

var path = {
  html: {
    src: 'src/*.html',
    dest: 'dist/',
    watch: 'src/*.html'
  },
  style: {
    src: 'src/scss/*.scss',
    dest: 'dist/',
    watch: 'src/scss/**/*.scss'
  },
  js: {
    src: 'src/js/main.js',
    dest: 'dist/',
    watch: 'src/js/*.js'
  },
  fonts: {
    src: 'src/fonts/**/*',
    dest: 'dist/fonts/'
  },
  image: {
    src: 'src/images/**/*',
    dest: 'dist/images'
  },
  video: {
    src: 'src/video/*',
    dest: 'dist/video/'
  },
  clean: 'dist'
};

var config = {
  server: {
    baseDir: './dist/'
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
  return src(path.html.src)
    .pipe(dest(path.html.dest))
    .pipe(reload({ stream: true }));
}

// js
function js() {
  return src(path.js.src)
    // .pipe(sourcemaps.init())
    .pipe(rigger())
		.pipe(minify({
			noSource: true,
			ext: {
				min: '.min.js'
			}
    }))
    // .pipe(sourcemaps.write('.'))
    .pipe(dest(path.js.dest))
    .pipe(reload({ stream: true }));
}

// style
function style() {
  return src(path.style.src)
    // .pipe(sourcemaps.init())
    .pipe(sass().on('error', notify.onError()))
    .pipe(rename({ suffix: '.min', prefix: '' }))
    .pipe(prefixer())
    .pipe(gcmq())
    .pipe(cssmin())
    // .pipe(sourcemaps.write('.'))
    .pipe(dest(path.style.dest))
    .pipe(reload({ stream: true }));
}

// fonts
function fonts() {
  return src(path.fonts.src)
    .pipe(dest(path.fonts.dest));
}

// images
function image() {
  return src(path.image.src)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(dest(path.image.dest))
}

// video
function video() {
  return src(path.video.src)
    .pipe(dest(path.video.dest));
}

// watch
function devwatch() {
  watch(path.html.watch, html);
  watch(path.style.watch, style);
  watch(path.js.watch, js);
}

// clean
function clean() {
  return del(path.clean);
}

// build
var build = series(clean, parallel(html, fonts, image, style, js, video));

// default
task('default', series(build, parallel(webserver, devwatch)));


//// svg sprite
var svgSprite = require('gulp-svg-sprite');
task('svgSprite', function () {
  return src('images/icons/*.svg') //svg files for sprite
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"  //sprite file name
        }
      },
    }
    ))
    .pipe(dest('images/'));
});