/**
  * source: https://www.mikestreety.co.uk/blog/advanced-gulp-file
  *
  * - JS:
  *    - [OK] rename (pour remplacer les points par des tirets) => http://stackoverflow.com/questions/2390789/how-to-replace-all-dots-in-a-string-using-javascript
  *    - [OK] minifier
  *    - [OK] Voir pour un fichier "vendor" qui liste les fichiers vendor à minifier.
  *      => http://gulpjs.org/recipes/using-external-config-file.html
  *      => http://stackoverflow.com/questions/42711164/gulp-watch-not-updating-json-file
  *    - [NOK] Les modifications dans le fichier "vendor.json" ne sont pas pris en compte par la tache "watch". 
  *    - Change possède déjà les fonctionnalités de concaténation des JS.
  * - [OK] Autoprefixer
  * - [NOK] (Sourcemaps?) => http://frontenddeveloper.0fees.net/change-3-xgulp-ajouter-les-sourcemaps-dans-rbs-change/
  * - CSS: => un simple déplacement des fichiers source.
  * - [OK] SASS: => CSS
  * - [TODO] LESS: => CSS
  *    - Change possède déjà les fonctionnalités de minification des CSS.
  * - JPG, GIF, PNG: => compression, (sprite?)
  * - SVG: => compression, sprite, (police d'icônes?)
  * - FONT: => un simple déplacement des fichiers source.
  */

var basePaths = {
    src: './src/',
    dest: './',
    bower: 'src/vendor'
};

var paths = {
    images: {
        src: basePaths.src + 'image/',
        dest: basePaths.dest + 'image/'
    },
    scripts: {
        src: basePaths.src + 'js/',
        dest: basePaths.dest + 'js/'
    },
    styles: {
        src: basePaths.src + 'style/',
        dest: basePaths.dest + 'style/'
    },
    sprite: {
        src: basePaths.src + 'sprite/*'
    },
    fonts: {

    }
};

var appFiles = {
  styles: paths.styles.src + '**/*.scss',
  scripts: [paths.scripts.src + '*.js', './vendor.json']
};

var vendorFiles = {
  styles: '',
  scripts: ''
};

var spriteConfig = {
  imgName: 'sprite.png',
  cssName: '_sprite.scss',
  imgPath: paths.images.dest.replace('public', '') + 'sprite.png' // Gets put in the css
};

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

// Uglify a selection of vendor JS sources
var vendor = require('./vendor.json');

// Allows gulp --dev to be run for a more verbose output
var sassStyle = 'compressed';

var changeEvent = function(evt) {
  gutil.log('File', gutil.colors.cyan(evt.path.replace(new RegExp('/.*(?=/' + basePaths.src + ')/'), '')), 'was', gutil.colors.magenta(evt.type));
};

var doUglify = function(cfg) {
  gulp.src(cfg.src)
    .pipe(plugins.uglify())
    .pipe(plugins.rename(function(opt) {
      opt.basename = opt.basename.replace(/\./g,'-');
      return opt;
    }))    
    .pipe(plugins.size())
    .pipe(gulp.dest(cfg.dest));
}

gulp.task('style', function() {
  gulp.src(paths.styles.src + '*.scss')
    .pipe(plugins.rubySass({
      style: sassStyle, precision: 2
    }))
    .on('error', function(err){
      new gutil.PluginError('CSS', err, {showStack: true});
    })
    .pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(plugins.size())
    .pipe(gulp.dest(paths.styles.dest));    
});

gulp.task('js', function() {
  // Uglify vendor JS...
  doUglify(vendor.js);
  // ...then uglify custom JS
  gulp.src(paths.scripts.src + '*.js')
    .pipe(plugins.uglify())
    .pipe(plugins.rename(function(opt) {
      opt.basename = opt.basename.replace(/\./g,'-');
      return opt;
    }))    
    .pipe(plugins.size())
    .pipe(gulp.dest(paths.scripts.dest));
});


/*
  Sprite Generator
*/
gulp.task('sprite', function () {
  var spriteData = gulp.src(paths.sprite.src).pipe(plugins.spritesmith({
    imgName: spriteConfig.imgName,
    cssName: spriteConfig.cssName,
    imgPath: spriteConfig.imgPath,
    cssOpts: {
      functions: false
    },
    cssVarMap: function (sprite) {
      sprite.name = 'sprite-' + sprite.name;
    }
  }));
  spriteData.img.pipe(gulp.dest(paths.images.dest));
  spriteData.css.pipe(gulp.dest(paths.styles.src));
});

gulp.task('watch', ['sprite', 'style', 'js'], function(){
  gulp.watch(appFiles.styles, ['style']).on('change', function(evt) {
    changeEvent(evt);
  });
  gulp.watch(appFiles.scripts, ['js']).on('change', function(evt) {
    changeEvent(evt);
  });
  gulp.watch(paths.sprite.src, ['sprite']).on('change', function(evt) {
    changeEvent(evt);
  });
});

gulp.task('default', ['style', 'js']);