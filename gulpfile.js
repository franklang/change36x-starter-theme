/* jshint node: true */
'use strict';

/**
 * Usage général :
 *
 *  - tâche "gulp" : fichiers compilés dans "/dist" (ni minifiés ni concaténés).
 *    Le client peut modifier, améliorer et mettre en prod lui-même.
 *
 *  - tâche "gulp --prod" : fichiers compilés dans "/dist" (minifiés, concaténés,
 *    optimisés, etc.). Le client utilise tel quel.
 */


/**
 * Chargement et initialisation des composants utilisés
 */
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    browserSync = require('browser-sync').create(),
    gulpSync = require('gulp-sync')(gulp),
    argv = require('yargs').argv,
    del = require('del');


/**
 * Configuration générale du projet et des composants utilisés
 */
var project = {
  name: 'starter', // nom du projet, utilisé notamment pour le fichier ZIP
  url: 'http://localhost/', // url du projet, utilisée par browserSync en mode proxy
  zip: {
    namespace: 'starter', // préfixe du fichier ZIP
  },
  globalJSFile: 'global-min.js', // nom du fichier JS après concaténation
  plugins: { // activation ou désactivation de certains plugins à la carte
    browserSync: {
      status: false, // utilisation du plugin browserSync lors du Watch ?
      proxyMode: false, // utilisation du plugin browserSync en mode proxy (si false en mode standalone)
    }
  },
  configuration: { // configuration des différents composants de ce projet
    cssbeautify: {
      indent: '  ',
    },
    htmlExtend: {
      annotations: false,
      verbose: false,
    },
    imagemin: {
      svgoPlugins: [
        {
          removeViewBox: false,
        }, {
          cleanupIDs: false,
        },
      ],
    },
  },
};


/**
 * Chemins vers les ressources ciblées
 */
var paths = {
  root: './', // dossier actuel
  src: './src/', // dossier de travail
  dest: './dist/', // dossier destiné à la livraison
  vendors: './node_modules/', // dossier des dépendances du projet
  assets: 'assets/',
  styles: {
    root: 'assets/css/', // dossier contenant les fichiers CSS & Sass
    css: {
      mainFile: 'assets/css/styles.css', // fichier CSS principal
      files: 'assets/css/*.css', // cible tous les fichiers CSS
    },
    sass: {
      mainFile: 'assets/css/styles.scss', // fichier Sass principal
      files: 'assets/css/{,includes/}*.scss', // fichiers Sass à surveiller
    },
  },
  scripts: {
    root: 'assets/js/', // dossier contenant les fichiers JavaScript
    files: 'assets/js/*.js', // fichiers JavaScript (hors vendor)
  },
  html: {
    racine: '*.html', // fichiers & dossiers HTML à compiler / copier à la racine uniquement
    allFiles: '{,includes/}*.html', // fichiers & dossiers HTML à compiler / copier à la racine et dans le dossier includes/
  },
  styleguide: {
    config: 'assets/styleguide/config.md', // fichier config du styleguide
    files: 'assets/styleguide/patterns/*.md', // fichiers .MD du styleguide
  },
  php: '{,includes/}*.php', // fichiers & dossiers PHP à copier
  fonts: 'assets/css/fonts/', // fichiers typographiques à copier,
  images: 'assets/{,css/}img/*.{png,jpg,jpeg,gif}', // fichiers images à compresser
  icons: 'assets/icons/*.svg', // fichiers icônes SVG
  misc: '*.{ico,htaccess,txt}', // fichiers divers à copier
  maps: '/maps', // fichiers provenant de sourcemaps
};


/**
 * Ressources JavaScript utilisées par ce projet (vendors + scripts JS spécifiques)
 */
var vendors = [
  paths.vendors + 'jquery/dist/jquery.min.js',
  paths.vendors + 'styledown-skins/dist/Default/styleguide.min.js',
  paths.vendors + 'swiper/dist/js/swiper.min.js',
  paths.src + paths.scripts.files,
];


/**
 * Tâche de gestion des erreurs à la volée
 */
var onError = {
  errorHandler: function (err) {
    $.util.beep();
    console.log(err);
    this.emit('end');
  }
};

/**
 * Tâche de production si ajout de l'argument "--prod"
 */
var isProduction = argv.prod;


/* ------------------------------------------------
 * Tâches de Build : css, html, php, js, img, fonts
 * ------------------------------------------------
 */

// Tâche CSS : Sass + Autoprefixer + CSScomb + beautify + minify (si prod)
gulp.task('css', function () {
  return gulp.src(paths.src + paths.styles.sass.mainFile)
    .pipe($.plumber(onError))
    .pipe($.sourcemaps.init())
    .pipe($.sass())
    .pipe($.csscomb())
    .pipe($.cssbeautify(project.configuration.cssbeautify))
    .pipe($.autoprefixer())
    .pipe(gulp.dest(paths.dest + paths.styles.root))
    .pipe($.if(isProduction, $.rename({suffix: '.min'})))
    .pipe($.if(isProduction, $.csso()))
    .pipe($.sourcemaps.write(paths.maps))
    .pipe(gulp.dest(paths.dest + paths.styles.root));
});

// Tâche HTML : includes HTML
gulp.task('html', function () {
  return gulp.src(paths.src + paths.html.allFiles)
    .pipe($.plumber(onError))
    .pipe($.htmlExtend(project.configuration.htmlExtend))
    .pipe(gulp.dest(paths.dest));
});

// Tâche PHP : simple copie des fichiers PHP
gulp.task('php', function () {
  return gulp.src(paths.src + paths.php)
    .pipe(gulp.dest(paths.dest));
});

// Tâche JS : copie des fichiers JS et vendor + babel (+ concat et uglify si prod)
gulp.task('js', function () {
  return gulp.src(vendors)
    .pipe($.plumber(onError))
    .pipe($.babel({presets:['es2015','es2016']})) // ,'es2017'
    .pipe(gulp.dest(paths.dest + paths.scripts.root))
    .pipe($.if(isProduction, $.concat(project.globalJSFile)))
    .pipe($.if(isProduction, $.uglify()))
    .pipe(gulp.dest(paths.dest + paths.scripts.root));
});

// Tâche IMG : optimisation des images
gulp.task('img', function () {
  return gulp.src(paths.src + paths.images)
    .pipe($.changed(paths.dest + paths.assets))
    .pipe($.imagemin())
    .pipe(gulp.dest(paths.dest + paths.assets));
});

// Tâche SVGSTORE : combine all svg sources into single svg file with <symbol> elements
gulp.task('svgstore', function () {
  return gulp.src(paths.src + paths.icons)
    .pipe($.imagemin(project.configuration.imagemin))
    .pipe($.svgstore())
    .pipe(gulp.dest(paths.dest + paths.assets));
});

// Tâche FONTS : copie des fichiers typographiques
gulp.task('fonts', function () {
  return gulp.src(paths.src + paths.fonts + '**/*')
    .pipe($.changed(paths.dest + paths.fonts))
    .pipe(gulp.dest(paths.dest + paths.fonts));
});

// Tâche MISC : copie des fichiers divers
gulp.task('misc', function () {
  var dottedFiles = { dot: true };
  return gulp.src(paths.src + paths.misc, dottedFiles)
    .pipe($.changed(paths.dest))
    .pipe(gulp.dest(paths.dest));
});



/* ------------------------------------------------
 * Tâches autonomes : styleguide, zip, clean
 * ------------------------------------------------
 */

// Tâche STYLEGUIDE : création automatique d'un guide des styles
gulp.task('guide', function () {
  return gulp.src(paths.src + paths.styleguide.files)
    .pipe($.plumber(onError))
    .pipe($.styledown({
      config: paths.src + paths.styleguide.config,
      filename: 'styleguide.html'
    }))
    .pipe(gulp.dest(paths.dest));
});

// Tâche ZIP : création de fichier .zip du projet
gulp.task('archive', function () {
  if(argv.prod) {
    project.zip.name = 'prod';
  } else {
    project.zip.name = 'build';
  }
  var now = new Date(),
      date = now.getFullYear() + '-' + ( now.getMonth() + 1 ) + '-' + now.getDate() + '-' + now.getHours() + 'h' + now.getMinutes(),
      zipName = project.zip.namespace + '-' + project.name + '-' + project.zip.name + '-' + date + '.zip';
  return gulp.src(paths.dest + '/**/')
    .pipe($.zip(zipName))
    .pipe(gulp.dest(paths.root));
});

// Tâche CLEAN : supprime les fichiers CSS et JavaScript inutiles en production
gulp.task('clean', function () {
  return del([
    paths.dest + paths.scripts.files, // on supprime tous les fichiers JS de production
    paths.dest + paths.styles.css.files, // on supprime tous les fichiers CSS de production
    '!' + paths.dest + paths.scripts.root + project.globalJSFile, // sauf les JS concaténés finaux
    '!' + paths.dest + paths.styles.root + 'styles.min.css', // sauf les CSS concaténés finaux
  ]);
});

/* ----------------------------------
 * Tâches principales : récapitulatif
 * ----------------------------------
 */

// Tâche BUILD : tapez "gulp" ou "gulp build"
gulp.task('build', ['css', 'js', 'html', 'img', 'svgstore', 'fonts', 'php', 'misc']);

// Tâche PROD : tapez "gulp build --prod"

// Tâche STYLEGUIDE : (tapez "gulp styleguide")
gulp.task('styleguide', gulpSync.sync(['css', 'guide']));

// Tâche ZIP : (tapez "gulp zip" ou "gulp zip --prod")
gulp.task('zip', gulpSync.sync(['build', 'archive']));

// Tâche WATCH : surveillance Sass, HTML et PHP
gulp.task('watch', function () {
  // si demandé, on créé la configuration du plugin browserSync et on l'initialise
  if (project.plugins.browserSync.status === true) {
    var browserSyncConf; // variable contenant la configuration de browserSync
    if (project.plugins.browserSync.proxyMode === true) {
      // initialisation du mode proxy si demandé
      browserSyncConf = {
        proxy: project.url,
      };
    } else {
      // sinon on initialise le mode standalone
      browserSyncConf = {
        server: {
          baseDir: paths.dest,
        }
      };
    }
    // on initialise le plugin browserSync
    browserSync.init(browserSyncConf);
  }

  gulp.watch([paths.src + paths.styles.sass.files], ['css', browserSync.reload]);
  gulp.watch([paths.src + paths.html.allFiles, paths.src + paths.php], ['html', 'php', browserSync.reload]);
  gulp.watch([paths.src + paths.scripts.files], ['js', browserSync.reload]);
});

// Tâche par défaut
gulp.task('default', ['build']);
