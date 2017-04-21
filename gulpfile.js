/**
  *
  * TODOs:
  *
  * - Fixer les versions dans package.json
  * - séparer configs des paths (gulp-paths.json) et des plugins/tâches (gulp-conf.js) -> un 1er pas vers la modularité des tâches.
  * - minify: true/false + concatenate: true/false ?
  * - LESS: => CSS
  * - image sprite
  * - iconfont
  * - FONT: => un simple déplacement des fichiers source.
  * - auto-génération d'un guide de styles
  *
  *
  * BUGs:
  * - nada :)
  *
  *
  * TESTs:
  * /!\ retester la tâche default lorsque le watch fonctionnera correctement.
  * Au 1er lancement du watch :
  *    - les images sont générées: OK
  *      - on ajoute une image en src: OK
  *      - on retire une image en src: OK
  *    - les JS vendor et custom sont générés: OK
  *      - on ajoute un JS vendor: OK
  *      - on retire un JS vendor: OK
  *      - on ajoute un JS custom: OK
  *      - on fait une modif sur un JS custom: OK
  *      - on retire un JS custom: OK
  *    - le sprite svg est généré: OK
  *      - on ajoute un SVG, le sprite est mis à jour: OK
  *      - on retire un SVG, le sprite est mis à jour: OK
  *    - la SCSS custom "main" et la CSS vendor "bootstrap-min" sont générées : OK
  *      - on ajoute du code dans main.scss et ça se met à jour: OK
  *      - on ajoute une CSS vendor et elle est générée: OK  
  *
  */

var gulp = require('gulp');
var del = require('del');
var es = require('event-stream');
var gutil = require('gulp-util');
var plugins = require("gulp-load-plugins")({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});
var fs = require('fs');
var gulpconf = "./gulpconf.json";
var config = require('./gulpconf.json');

// var spriteConfig = {
//   imgName: 'sprite.png',
//   cssName: '_sprite.scss',
//   imgPath: config.paths.images.dest.replace('public', '') + 'sprite.png' // Gets put in the css
// };



/* Clean tasks */
function gulpClean(type, format){
  var arr = eval("config.clean."+type+".ignore");
  arr.unshift(eval("config.paths."+type+"s.dest + '*."+format+"'"));
  del.sync(arr);
}

gulp.task('style:clean', function(){
  gulpClean('style', 'css');
});

gulp.task('script:clean', function(){
  del.sync(config.paths.scripts.dest);
});

gulp.task('media:clean', function(){
  del.sync(config.paths.images.dest);
});
/* end: Clean tasks */


/* Specific tasks */
gulp.task('css:vendor', function() {
  var json = JSON.parse(fs.readFileSync(gulpconf)),
  vendorcss = json.css.vendor;

  gulp.src(vendorcss)
    .pipe(plugins.changed(config.paths.styles.dest))
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
    .pipe(plugins.changed(config.paths.styles.dest))
    .pipe(plugins.sass().on('error', plugins.sass.logError))
    .pipe(plugins.autoprefixer(config.plugins.autoprefixer.browsers))
    .pipe(plugins.shorthand())
    .pipe(plugins.replace('url("', 'url('))
    .pipe(plugins.replace('")', ')'))
    .pipe(gulp.dest(config.paths.styles.dest));
});

gulp.task('js:vendor',function(){
  var json = JSON.parse(fs.readFileSync(gulpconf)),
  vendorjs = json.js.vendor;

  return gulp.src(vendorjs)
    .pipe(plugins.changed(config.paths.scripts.dest))
    .pipe(plugins.uglify())
    .pipe(plugins.rename(function(opt) {
      opt.basename = opt.basename.replace(/\./g,'-');
      return opt;
    }))    
    .pipe(gulp.dest(config.paths.scripts.dest));
});

gulp.task('js:custom', function() {
  return gulp.src(config.paths.scripts.src + '*.js')
    .pipe(plugins.changed(config.paths.scripts.dest))
    .pipe(plugins.uglify())
    .pipe(plugins.rename(function(opt) {
      opt.basename = opt.basename.replace(/\./g,'-');
      return opt;
    }))    
    .pipe(gulp.dest(config.paths.scripts.dest));
});

gulp.task('svg:sprite', function () {
  return gulp.src(config.paths.images.sprites.svg.src + '*.svg')
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
    .pipe(plugins.rename(config.paths.images.sprites.svg.output))
    .pipe(gulp.dest(config.paths.images.sprites.svg.dest));
});

gulp.task('image', function () {
  return gulp.src(config.paths.images.src + config.plugins.imagemin.formats)
    .pipe(plugins.changed(config.paths.images.dest))
    .pipe(plugins.imagemin())
    .pipe(gulp.dest(config.paths.images.dest));
});
/* end: Specific tasks */

/*
  Sprite Generator
*/
// gulp.task('sprite', function () {
//   var spriteData = gulp.src(config.paths.sprites.src).pipe(plugins.spritesmith({
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



/* Tasks */
gulp.task('default', ['style', 'script', 'media']);

gulp.task('style', ['style:clean', 'css:vendor', 'sass']);
gulp.task('script', ['script:clean', 'js:vendor', 'js:custom']);
gulp.task('media', ['media:clean', 'svg:sprite', 'image']);

var appFiles = {
  styles: [config.paths.styles.src + '**/*.scss', './gulpconf.json'],
  scripts: [config.paths.scripts.src + '*.js', './gulpconf.json'],
  svgSprite: config.paths.images.sprites.svg.src + '*.svg',
  images: config.paths.images.src + config.plugins.imagemin.formats
};

gulp.task('watch', ['style', 'script', 'media'], function(){
  gulp.watch(appFiles.styles, ['style']);
  gulp.watch(appFiles.scripts, ['script']);
  gulp.watch(appFiles.svgSprite, ['svg:sprite']);
  gulp.watch(appFiles.images, ['media:clean', 'image']);
  // gulp.watch(config.paths.sprites.src, ['sprite']).on('change', function() {});
});
