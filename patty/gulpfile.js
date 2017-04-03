var gulp          = require('gulp');
var scss          = require('gulp-sass');
var sourcemaps    = require('gulp-sourcemaps');
var cleanCSS      = require('gulp-clean-css');
var gutil         = require('gulp-util');
var autoprefixer  = require('gulp-autoprefixer');

var isProduction = false;

var paths = {
  root:'./',
	scssPartials:'./public/scss/_partials/*.scss',
  scssMain:'./public/scss/*.scss'
}

paths.scssAll = [paths.scssMain, paths.scssPartials];
gulp.task('styleGlobal', function() {
    return gulp.src(paths.scssMain)
      .pipe(sourcemaps.init({
        loadMaps:true
      }))
      .pipe(scss())
      .pipe(autoprefixer({
        browsers: ['last 4 versions', '> 1%']
      }))
      /*.pipe(rename({suffix: '.min'}))*/
      .pipe(isProduction ? cleanCSS({
        restructuring: false,
        advanced: false // OTHERWISE REMOVES CSS THAT HAS VENDOR PREFIXES LIKE display: flex
      }) : gutil.noop())
      .pipe(sourcemaps.write('.',{
        sourceRoot: '.'
      }))
      .pipe(gulp.dest('./public/css'))
});

gulp.task('stylePartials', function() {
    return gulp.src(paths.scssPartials)
      .pipe(scss())
      .pipe(autoprefixer({
        browsers: ['last 4 versions', '> 1%']
      }))
      .pipe(gulp.dest('./public/css/_partials'))
});

gulp.task('watch',function(){
  gulp.watch(paths.scssAll,['styleGlobal','stylePartials']); 
});

gulp.task('default', ['styleGlobal','stylePartials','watch']);