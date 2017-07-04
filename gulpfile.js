/**
  *
  * TODOs:
  *
  * - séparer configs des paths (gulp-paths.json) et des plugins/tâches (gulp-conf.js) -> un 1er pas vers la modularité des tâches.
  * - minify: true/false + concatenate: true/false ?
  * - LESS: => CSS
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
var merge = require('merge-stream');
var path = require('path');
var gutil = require('gulp-util');
var cleanCSS = require('gulp-clean-css');
var plugins = require("gulp-load-plugins")({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});
var fs = require('fs');
var runSequence = require('run-sequence');
var gulpconf = "./gulpconf.json";
var config = require('./gulpconf.json');


/* Clean tasks */
gulp.task('style:clean', function(){
  var arr = config.clean.style.ignore;
  arr.unshift(config.paths.styles.dest + '*.css');
  del.sync(arr);  
});

gulp.task('script:clean', function(){
  var arr = config.clean.script.ignore;
  arr.unshift(config.paths.scripts.dest + '*.js');
  del.sync(arr);  
});

gulp.task('media:clean', function(){
  del.sync(config.paths.images.dest + '**/*.{png,PNG,jpg,JPG,gif,GIF}');
});
/* end: Clean tasks */

/*
 * Specific tasks
 */
gulp.task('css:vendor', function() {
  var json = JSON.parse(fs.readFileSync(gulpconf)),
  vendorcss = json.css.vendor;

  gulp.src(vendorcss)
    .pipe(plugins.changed(config.paths.styles.dest))
    .pipe(plugins.autoprefixer(config.plugins.autoprefixer.browsers))
    .pipe(cleanCSS())
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
    .pipe(cleanCSS())
    .pipe(plugins.replace('url("', 'url('))
    .pipe(plugins.replace('")', ')'))
    .pipe(plugins.replace('"embedded-opentype', "'embedded-opentype'"))
    .pipe(plugins.replace('"woff2', "'woff2'"))
    .pipe(plugins.replace('"woff', "'woff'"))
    .pipe(plugins.replace('"truetype', "'truetype'"))
    .pipe(plugins.replace('"svg', "'svg'"))
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

gulp.task('font', function() {
  return gulp.src(config.paths.fonts.src + '**/*.{ttf,woff,woff2,eof,otf,svg}')
    .pipe(plugins.changed(config.paths.fonts.dest))
    .pipe(gulp.dest(config.paths.fonts.dest));
});

gulp.task('image', function () {
  return gulp.src(config.paths.images.src + config.plugins.imagemin.formats)
    .pipe(plugins.changed(config.paths.images.dest))
    .pipe(plugins.imagemin())
    .pipe(gulp.dest(config.paths.images.dest));
});

function spriteData(folder, format){
  return gulp.src(path.join(config.paths.images.sprites.src, folder, '*'+format))
    .pipe(plugins.changed(config.paths.images.dest))
    .pipe(plugins.imagemin())
    .pipe(plugins.spritesmith({
      cssName: config.plugins.spritesmith.cssName + folder + '.' + config.plugins.spritesmith.cssFormat,
      imgName: config.plugins.spritesmith.imgName + folder + format,
      imgPath: config.plugins.spritesmith.imgPath + config.plugins.spritesmith.imgName + folder + format,
      cssVarMap: function (sprite) {
        sprite.name = config.plugins.spritesmith.classPrefix + sprite.name;
      }
    }));
}

gulp.task('bitmap:sprite', plugins.folders(config.paths.images.sprites.src, function (folder) {
  var spriteDataPng = spriteData(folder,'.png');
  var spriteDataJpg = spriteData(folder,'.jpg');
  var imgStreamPng = spriteDataPng.img
    .pipe(gulp.dest(config.paths.images.dest));
  var cssStreamPng = spriteDataPng.css
    .pipe(gulp.dest(config.paths.styles.src));
  var imgStreamJpg = spriteDataJpg.img
    .pipe(gulp.dest(config.paths.images.dest));
  var cssStreamJpg = spriteDataJpg.css
    .pipe(gulp.dest(config.paths.styles.src));
  return merge(imgStreamPng, cssStreamPng, imgStreamJpg, cssStreamJpg);
}));

gulp.task('iconfont', function () {
  return gulp.src(config.paths.iconfont.src + '*.svg')
    .pipe(plugins.changed(config.paths.iconfont.dest))
    .pipe(plugins.svgmin())
    .pipe(plugins.iconfont(config.plugins.iconfont))
    .on('glyphs', function (glyphs) {
      // console.log(glyphs);
      gulp.src(config.paths.iconfont.templateSrc)
        .pipe(plugins.consolidate('lodash', {
          glyphs: glyphs,
          fontName: config.plugins.consolidate.lodash.fontName,
          fontPath: config.plugins.consolidate.lodash.fontPath,
          className: config.plugins.consolidate.lodash.className
        }))
        .on('error', function(e){console.log(e);})
        .pipe(gulp.dest(config.paths.iconfont.templateDest));
    })
    .pipe(gulp.dest(config.paths.iconfont.dest));
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
/* end: Specific tasks */


/* Tasks */
gulp.task('default', function(cb) {
  runSequence(
    'media', 'style', 'script',
    cb
  );
});

gulp.task('media', ['media:clean'], function(cb) {
  runSequence(
    'font', 'image', 'bitmap:sprite', 'iconfont', 'svg:sprite', 
    cb
  );
});

gulp.task('style', ['style:clean'], function(cb) {
  runSequence(
    'css:vendor', 'sass',
    cb
  );
});

gulp.task('script', ['script:clean'], function(cb) {
  runSequence(
    'js:vendor', 'js:custom',
    cb
  );  
});

var appFiles = {
  fonts: config.paths.fonts.src + '**/*.{ttf,woff,woff2,eof,otf,svg}',
  images: config.paths.images.src + config.plugins.imagemin.formats,
  bitmapSprite: config.paths.images.sprites.src + '**/*.{png,jpg}',
  iconFont: config.paths.iconfont.src + '*.svg',
  svgSprite: config.paths.images.sprites.svg.src + '*.svg',
  styles: [config.paths.styles.src + '**/*.scss', './gulpconf.json'],
  scripts: [config.paths.scripts.src + '*.js', './gulpconf.json']
};

gulp.task('watch', ['media', 'style', 'script'], function(){
  gulp.watch(appFiles.fonts, ['media:clean', 'font']);
  gulp.watch(appFiles.images, ['media:clean', 'image']);
  gulp.watch(appFiles.bitmapSprite, ['media:clean', 'bitmap:sprite']);
  gulp.watch(appFiles.iconFont, ['media:clean', 'iconfont']);
  gulp.watch(appFiles.svgSprite, ['media:clean', 'svg:sprite']);
  gulp.watch(appFiles.styles, ['style']);
 gulp.watch(appFiles.scripts, ['script']);
});
