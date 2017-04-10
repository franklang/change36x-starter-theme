/**
  * source: https://www.mikestreety.co.uk/blog/advanced-gulp-file
  *
  * - CSS: => un simple déplacement des fichiers source.
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

var watch = require('gulp-watch');

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
  scripts: [config.paths.scripts.src + '*.js', './gulpconf.json'],
  svgSprite: config.paths.images.sprite.svg.src + '*.svg',
  images: config.paths.images.src + config.plugins.imagemin.formats
};

// var spriteConfig = {
//   imgName: 'sprite.png',
//   cssName: '_sprite.scss',
//   imgPath: config.paths.images.dest.replace('public', '') + 'sprite.png' // Gets put in the css
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
  return watch(config.paths.scripts.src + '*.js', function(){
    gulp.src(config.paths.scripts.src + '*.js')
      .pipe(plugins.uglify())
      .pipe(plugins.rename(function(opt) {
        opt.basename = opt.basename.replace(/\./g,'-');
        return opt;
      }))    
      .pipe(gulp.dest(config.paths.scripts.dest));
  });
});

gulp.task('svg:sprite', function () {
  return watch(config.paths.images.sprite.svg.src + '*.svg', function(){
    gulp.src(config.paths.images.sprite.svg.src + '*.svg')
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
});

gulp.task('style', function() {
  return watch(config.paths.styles.src + '**/*.scss', function(){
    gulp.src(config.paths.styles.src + '**/*.scss')
      .pipe(plugins.rubySass({
        style: sassStyle, precision: 2
      }))
      .on('error', function(err){
        new gutil.PluginError('CSS', err, {showStack: true});
      })
      .pipe(plugins.autoprefixer(config.plugins.autoprefixer.browsers))
      .pipe(gulp.dest(config.paths.styles.dest));
  });
});

// Tâche IMG : optimisation des images
gulp.task('image', function () {
  return watch(config.paths.images.src + config.plugins.imagemin.formats, function() {
    gulp.src(config.paths.images.src + config.plugins.imagemin.formats)
      .pipe(plugins.imagemin())
      .pipe(gulp.dest(config.paths.images.dest));
  });
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
gulp.task('watch', ['style', 'js:vendor', 'js:custom', 'svg:sprite', 'image'], function(){
  gulp.watch(appFiles.styles, ['style']).on('change', function(evt) {
    changeEvent(evt);   
  });
  gulp.watch(appFiles.scripts, ['js:vendor', 'js:custom']).on('change', function(evt) {
    changeEvent(evt);
  });
  gulp.watch(appFiles.svgSprite, ['svg:sprite']).on('change', function(evt) {
    changeEvent(evt);
  });
  gulp.watch(appFiles.images, ['image']).on('change', function(evt) {
    changeEvent(evt);
  });
  // gulp.watch(config.paths.sprite.src, ['sprite']).on('change', function(evt) {
  //   changeEvent(evt);
  // });
});

gulp.task('default', ['style', 'js']);