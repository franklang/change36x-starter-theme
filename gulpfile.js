/**
  * source: https://www.mikestreety.co.uk/blog/advanced-gulp-file
  *
  * - JS:
  *    - [OK] rename (pour remplacer les points par des tirets) => http://stackoverflow.com/questions/2390789/how-to-replace-all-dots-in-a-string-using-javascript
  *    - [OK] minifier
  *    - [OK] Voir pour un fichier "vendor" qui liste les fichiers vendor à minifier.
  *      => http://gulpjs.org/recipes/using-external-config-file.html
  *      => http://stackoverflow.com/questions/42711164/gulp-watch-not-updating-json-file
  *    - [OK] Les modifications dans le fichier "gulpconf.json" ne sont pas pris en compte par la tache "watch".
  *      => https://github.com/jgable/gulp-cache/issues/9
  *      => http://stackoverflow.com/questions/43111844/gulp-watch-detects-changes-to-external-config-file-but-doesnt-apply-them
  *      => http://blog.codesupport.info/gulp-minify-concat-javascript/
  *    - Change possède déjà les fonctionnalités de concaténation des JS.
  * - [OK] Autoprefixer
  * - [NOK] (Sourcemaps?) => http://frontenddeveloper.0fees.net/change-3-xgulp-ajouter-les-sourcemaps-dans-rbs-change/
  * - CSS: => un simple déplacement des fichiers source.
  * - [OK] SASS: => CSS
  * - [TODO] LESS: => CSS
  *    - Change possède déjà les fonctionnalités de minification des CSS.
  * - JPG, GIF, PNG: => compression, (sprite?)
  * - [OK] SVG: => compression, sprite, (police d'icônes?)
  * - FONT: => un simple déplacement des fichiers source.
  */


/*
  Let the magic begin
*/

var gulp = require('gulp');

var es = require('event-stream');
var gutil = require('gulp-util');

var plugins = require("gulp-load-plugins")({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});

var fs = require('fs');
var gulpconf = "./gulpconf.json";
var config = require('./gulpconf.json');

// Allows gulp --dev to be run for a more verbose output
var sassStyle = 'compressed';

var changeEvent = function(evt) {
  gutil.log('File', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + config.basePaths.src + ')/'), '')), 'was', gutil.colors.magenta(evt.type));
};

var appFiles = {
  styles: config.paths.styles.src + '**/*.scss',
  scripts: [config.paths.scripts.src + '*.js', './gulpconf.json']
};

// var vendorFiles = {
//   styles: '',
//   scripts: ''
// };

// var spriteConfig = {
//   imgName: 'sprite.png',
//   cssName: '_sprite.scss',
//   imgPath: config.paths.images.dest.replace('public', '') + 'sprite.png' // Gets put in the css
// };

// var autoprefixerConfig = {
//   browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
// };

gulp.task('js:vendor',function(){
  var json = JSON.parse(fs.readFileSync(gulpconf)),
  vendorjs = json.js.vendor;

  gulp.src(vendorjs)
    .pipe(plugins.uglify())
    .pipe(plugins.rename(function(opt) {
      opt.basename = opt.basename.replace(/\./g,'-');
      return opt;
    }))    
    .pipe(gulp.dest(config.paths.scripts.dest));
});

gulp.task('js:custom', function() {
  gulp.src(config.paths.scripts.src + '*.js')
    .pipe(plugins.uglify())
    .pipe(plugins.rename(function(opt) {
      opt.basename = opt.basename.replace(/\./g,'-');
      return opt;
    }))    
    .pipe(gulp.dest(config.paths.scripts.dest));
});

gulp.task('svg:sprite', function () {
  return gulp.src(config.paths.images.sprite.svg.src + '*.svg')
    .pipe(plugins.svgmin())
    .pipe(plugins.svgstore({
      inlineSvg: true
    }))
    .pipe(plugins.cheerio({
      run: function ($, file) {
          $('svg').css('display', 'none')
          $('[fill]').removeAttr('fill')
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(plugins.rename(config.paths.images.sprite.svg.output))
    .pipe(gulp.dest(config.paths.images.sprite.svg.dest));
});

gulp.task('style', function() {
  gulp.src(config.paths.styles.src + '*.scss')
    .pipe(plugins.rubySass({
      style: sassStyle, precision: 2
    }))
    .on('error', function(err){
      new gutil.PluginError('CSS', err, {showStack: true});
    })
    .pipe(plugins.autoprefixer(config.plugins.autoprefixer.browsers))
    .pipe(gulp.dest(config.paths.styles.dest));    
});

// Tâche IMG : optimisation des images
gulp.task('image', function () {
  return gulp.src(config.paths.images.src + '*.{png,jpg,jpeg,gif}')
    .pipe(plugins.imagemin())
    .pipe(gulp.dest(config.paths.images.dest));
});

/*
  Sprite Generator
*/
// gulp.task('sprite', function () {
//   var spriteData = gulp.src(config.paths.sprite.src).pipe(plugins.spritesmith({
//     imgName: spriteConfig.imgName,
//     cssName: spriteConfig.cssName,
//     imgPath: spriteConfig.imgPath,
//     cssOpts: {
//       functions: false
//     },
//     cssVarMap: function (sprite) {
//       sprite.name = 'sprite-' + sprite.name;
//     }
//   }));
//   spriteData.img.pipe(gulp.dest(config.paths.images.dest));
//   spriteData.css.pipe(gulp.dest(config.paths.styles.src));
// });

// gulp.task('watch', ['svg:sprite', 'sprite', 'style', 'js:vendor', 'js:custom'], function(){
gulp.task('watch', ['svg:sprite', 'style', 'js:vendor', 'js:custom'], function(){
  gulp.watch(config.paths.images.sprite.svg.src + '*.svg', ['svg:sprite']);
  gulp.watch(appFiles.styles, ['style']).on('change', function(evt) {
    changeEvent(evt);
  });
  gulp.watch(appFiles.scripts, ['js:vendor', 'js:custom']).on('change', function(evt) {
    changeEvent(evt);
  });
  // gulp.watch(config.paths.sprite.src, ['sprite']).on('change', function(evt) {
  //   changeEvent(evt);
  // });
});

gulp.task('default', ['style', 'js']);