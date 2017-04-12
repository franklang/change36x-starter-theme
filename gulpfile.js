/**
  * source: https://www.mikestreety.co.uk/blog/advanced-gulp-file
  *
  * TODOs:
  *
  * - !!! IMPORTANCE niveau 1 !!! Tâche default pour le script de déploiement de Steve.
  * - LESS: => CSS
  * - FONT: => un simple déplacement des fichiers source.
  *
  *
  * BUGs:
  * - La tâche de compilation SASS rajoute des guillemets ("") dans les URLs. Change n'aime pas.
  * - La tâche watch ne fonctionne pas pour les fichiers qu'on supprime.
  *
  *
  * TESTs:
  * /!\ retester la tâche default lorsque le watch fonctionnera correctement.
  * Au 1er lancement du watch :
  *    - les images sont générées: OK
  *      - on ajoute une image en src: OK
  *      - on retire une image en src: NOK => supression détectée dans la source, mais pas mis à jour.
  *    - les JS vendor et custom sont générés: OK
  *      - on ajoute un JS vendor: OK
  *      - on retire un JS vendor: NOK => supression détectée dans la source, mais pas mis à jour.
  *      - on ajoute un JS custom: OK
  *      - on fait une modif sur un JS custom: OK
  *      - on retire un JS custom: NOK => supression détectée dans la source, mais pas mis à jour.
  *    - le sprite svg est généré: OK
  *      - on ajoute un SVG, le sprite est mis à jour: OK
  *      - on retire un SVG, le sprite est mis à jour: OK
  *    - la SCSS custom "main" et la CSS vendor "bootstrap-min" sont générées : OK
  *      - on ajoute du code dans main.scss et ça se met à jour: OK
  *      - on ajoute une CSS vendor et elle est générée: OK  
  *
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

// var spriteConfig = {
//   imgName: 'sprite.png',
//   cssName: '_sprite.scss',
//   imgPath: config.paths.images.dest.replace('public', '') + 'sprite.png' // Gets put in the css
// };

gulp.task('css:vendor', function() {
  var json = JSON.parse(fs.readFileSync(gulpconf)),
  vendorcss = json.css.vendor;

  gulp.src(vendorcss)
    .pipe(plugins.autoprefixer(config.plugins.autoprefixer.browsers))
    .pipe(plugins.shorthand())
    .pipe(plugins.rename(function(opt) {
      opt.basename = opt.basename.replace(/\./g,'-');
      return opt;
    }))    
    .pipe(gulp.dest(config.paths.styles.dest));
});

gulp.task('sass', function() {
  gulp.src(config.paths.styles.src + '**/*.scss')
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer(config.plugins.autoprefixer.browsers))
    .pipe(plugins.shorthand())
    .pipe(gulp.dest(config.paths.styles.dest));
});

gulp.task('js:vendor',function(){
  var json = JSON.parse(fs.readFileSync(gulpconf)),
  vendorjs = json.js.vendor;

  return gulp.src(vendorjs)
    .pipe(plugins.uglify())
    .pipe(plugins.rename(function(opt) {
      opt.basename = opt.basename.replace(/\./g,'-');
      return opt;
    }))    
    .pipe(gulp.dest(config.paths.scripts.dest));
});

gulp.task('js:custom', function() {
  return gulp.src(config.paths.scripts.src + '*.js')
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

gulp.task('image', function () {
  return gulp.src(config.paths.images.src + config.plugins.imagemin.formats)
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

var appFiles = {
  styles: [config.paths.styles.src + '**/*.scss', './gulpconf.json'],
  scripts: [config.paths.scripts.src + '*.js', './gulpconf.json'],
  svgSprite: config.paths.images.sprite.svg.src + '*.svg',
  images: config.paths.images.src + config.plugins.imagemin.formats
};

gulp.task('watch', ['css:vendor', 'sass', 'js:vendor', 'js:custom', 'svg:sprite', 'image'], function(){
  gulp.watch(appFiles.styles, ['css:vendor', 'sass']).on('change', function(evt) {
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

gulp.task('default', ['css:vendor', 'sass', 'js:vendor', 'js:custom', 'svg:sprite', 'image']);