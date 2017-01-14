/** Packages **/
var gulp = require('gulp');
var gulpCache = require('gulp-cache');
var gulpCssnano = require('gulp-cssnano');
var gulpIf = require('gulp-if');
var gulpImagemin = require('gulp-imagemin');
var gulpOpen = require('gulp-open');
var gulpSass = require('gulp-sass');
var gulpUglify = require('gulp-uglify');
var gulpUseref = require('gulp-useref');

var browserSync = require('browser-sync').create();
var del = require('del');
var path = require('path');
var runSequence = require('run-sequence');
var swPrecache = require('sw-precache');


/**
* Gulpfile for scrum.cards project
*
* Developing commands:
* - use 'gulp serve' for local development
* - use 'gulp dist' for creating 'dist' folder with the app
* - use 'gulp dist:nocache' to clear the cache and do the above 'gulp dist' at once
*
* Other commands:
* - use 'gulp open:test' to open test url, http://test.scrum.cards in our case
* - use 'gulp open:prod' to open prod url, http://scrum.cards in our case
**/

/**
* This task compiles sass to css
*/
gulp.task('scss', function(){
	return gulp.src('app/scss/**/*.scss')
		.pipe(gulpSass())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
		  stream: true
		}))
});

/**
* This task generates the service worker
*/
gulp.task('generate-sw', function(callback) {
  var rootDir = 'app';

  swPrecache.write(`${rootDir}/service-worker.js`, {
    staticFileGlobs: [rootDir + '/**/*.{js,html,css,png,jpg,jpeg,gif,svg,ttf,woff}'],
    stripPrefix: rootDir
  }, callback);
});

/**
* This task task activates browserSync
*/
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

/**
* This task task watches changes and activates either of the above tasks accordingly
*/
gulp.task('watch', ['browserSync', 'scss'], function(){
  gulp.watch('app/scss/**/*.scss', ['scss']);
  gulp.watch('app/js/**/*.js', browserSync.reload); 
  gulp.watch('app/*.js', browserSync.reload);
  gulp.watch('app/*.html', browserSync.reload);
});

/**
* This task serves the app locally for easy local developing
*/
gulp.task('serve', function (callback) {
  runSequence(['scss','generate-sw','browserSync', 'watch'], callback)
});



/**
* This task makes html/js/css ready to 'dist' folder. (concats, uglify and cssnano)
*/
gulp.task('useref', function(){
  return gulp.src('app/*.html')
    .pipe(gulpUseref())
	  .pipe(gulpIf('*.js', gulpUglify()))
	  .pipe(gulpIf('*.css', gulpCssnano()))
    .pipe(gulp.dest('dist'))
});

/**
* This task compresses imagery to 'dist' folder
*/
gulp.task('images', function(){
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
	.pipe(gulpCache(gulpImagemin()))
	.pipe(gulp.dest('dist/images'))
});

/**
* This task copies over fonts to 'dist' folder
*/
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

/**
* This task cleans 'dist' folder
*/
gulp.task('clean:dist', function() {
  return del.sync('dist');
});

/**
* This task cleans cache
*/
gulp.task('clean:cache', function (callback) {
	return gulpCache.clearAll(callback);
});

/**
* This task runs all the above tasks to create the distributable app in 'dist' folder
*/
gulp.task('dist', function (callback) {
  runSequence('clean:dist',['scss', 'useref', 'images', 'fonts'],callback)
});

/**
* This task runs all the above tasks to create the distributable app in 'dist' folder and also clean the cache
*/
gulp.task('dist:nocache', function (callback) {
  runSequence('clean:cache', 'dist', callback)
});

/**
* This task opens the test url
*/
gulp.task('open:test', function(){
  return gulp.src(__filename)
	.pipe(gulpOpen({uri: 'http://test.scrum.cards'}));
});

/**
* This task opens the prod url
*/
gulp.task('open:prod', function(){
  return gulp.src(__filename)
	.pipe(gulpOpen({uri: 'http://scrum.cards'}));
});


