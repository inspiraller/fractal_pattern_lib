# How to work fractal pattern library

## Pre-requisites
- node, npm

## Getting started
1. cd to the root of your project
2. $ npm install @frctl/fractal -g
3. $ fractal new pattern_lib
[Enter] all
4. $ cd pattern_lib
5. Rename fractal.js to fractalfile.js
6. Add to package.json
```javascript
  "fractal":{
  	"main":"fractalfile.js"
  }
```
7. fractal start --sync

## Create first component that pulls data from a json file

**button.hbs**
```
/pattern_lib/
	button/
		button.hbs
```
```html
<button class="btn">{{value}}</button>
```

**button.config.yml**
```
/pattern_lib/
	button/
		button.config.yaml
```
```yaml
context:
  value: Submit		
```

## Create global css file that applies to all components
**add to fractalfile.js**
```javascript
fractal.components.set('default.preview','@preview');
```

**Create preview/preview.hbs**
```html
<!DOCTYPE html>
<html>
<head>
	<link type="text/css" rel="stylesheet" href="{{ path '/css/global.css' }}"/>
</head>
<body>
	{{{yield}}}
</body>
</html>
```

## How to user SCSS files to generate css to be imported into fractal on the fly
1. $ npm install gulp gulp-autoprefixer gulp-clean-css gulp-sass gulp-sourcemaps gulp-util npm-run-all --save-dev

2. add to package.json file

```javascript
  "scripts": {
    "watchScss":"gulp",
    "patternLib":"fractal start --sync",
    "start": "npm-run-all -p -r watchScss patternLib"
  },
```

3. Create a component partialscss file
/scss/_partials/btn.scss

4. Include equivalent css reference via compoennt.hbs
```html
<link type="text/css" rel="stylesheet" href="{{ path '/css/_partials/btn.css' }}"/>
```
Note: Do not underscore btn.scss otherwise it won't get generated.
The idea of this is to generate all the partials as individual css files just for the pattern library. For production we would bundle all those partials up into the global anyway.

5. Create gulpfile.js
```
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
      .pipe(gulp.dest('./public/css/_partials'))
});

gulp.task('watch',function(){
  gulp.watch(paths.scssAll,['styleGlobal','stylePartials']); 
});

gulp.task('default', ['styleGlobal','stylePartials','watch']);
```
### css files get generated like this
```
/scss/
	global.scss
	_partials/
		btn.scss

/css/
	global.css (this will be the production file, but for pattern library all the invididual components are generated individually)
	global.css.map
	_partials/
		btn.css
```




