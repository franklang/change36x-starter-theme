RBS Change 3.6.x starter theme
==============================

**See list of available Gulp tasks at the end of this readme file.**


Requirements
------------

* [NodeJS installed](https://docs.npmjs.com/getting-started/installing-node)
* [Bower installed](https://bower.io/)
* [Git installed](https://git-scm.com/)

**WARNING:** NPM version used for this project is **4.0.5**. Run `npm install npm@4.0.5` to get that version.
You might want to **use the same version** in order to avoid packages versions conflicts when running Gulp or any other NPM package for this project.
Also, if you run multiple projects at the same time (and potentially need multiple NPM versions to be available), it's better **not** to install NPM as global, but to proceed to a dedicated installation for each of your projects. So don't add the `-g` option when installing NPM.


Theme initialization and update
-------------------------------

**When starting from scratch**, clone the following repo: `git clone -b base-workflow https://github.com/franklang/change36x-starter-theme.git`.

**PLEASE NOTE :** execute `npm` and `bower` commands from the root of your theme, where either `package.json` and `bower.json` are stored.

Whenever you've just grabbed this starter bundle from GitHub and want to start a fresh theme development or just ran a `git pull` to get latest code updates from your team, **always do the following** to make sure you have an up-to-date list of installed dependencies and packages :

* Run `npm install` to get or update NodeJS packages list (essentially Gulp plugins)
* Run `bower install` to get or update theme front-end dependencies list


Bower + Gulp workflow
---------------------

### Files of interest :

* **bower.json** : list of front-end dependencies.
* **package.json** : list of Gulp plugins.
* **gulpconf.json** : configuration for available Gulp tasks. Edit this file to your needs (Gulp tasks source and destination paths, Gulp plugins configuration, JS vendors to be included to your theme source code).
* **gulpfile.js** : code for available Gulp tasks.


Start working with this starter theme
-------------------------------------

**WARNING!** Source code (styles and JS) and media (images, fonts, ...) :
1. **must** be stored within the *src/* folder
2. **must** be processed using Gulp.

Anything outside that *src/* folder might be lost by either being ignored by Git (see *.gitignore* file) or erased next time a Gulp task is run. 

By default, this theme is called `starter`. But if you need to use another name, you'll have to replace the default value within a few files (Please note: if default value is not `starter`, then this might have already been done by another developer from your team.) :

1. First, set `"theme"` value from the *gulpconf.json* to your theme name.
2. Then, rush over *src/style/main.scss* and set `$theme` variable value to your theme name too.
3. Finally, replace any occurence of the `starter` keyword you'll find with your theme name in *style/layout.css*, *style/skin.css* and *install.xml* files.


Overriding vendor components
----------------------------

You'll find *vendor-override/* folders at the root of both *src/style/* and *src/js/*. Use them to override vendor components.
**PLEASE** keep original vendor folders and files structure when overriding. Example :

Put overriden version of original :
```json
src/vendor/foundation-sites/scss/settings/_settings.scss
```

in :
```json
src/styles/vendor-override/foundation-sites/scss/settings/_settings.scss
```


Styles
------

Running `gulp style` will process all style tasks once; then stop.

### Use vendor CSS files :

Please note that Gulp `css:vendor` task is automatically replacing **.** characters with **-** in file names in order to meet RBS Change CSS dependencies naming conventions.

Also, we don't care about Gulp-concatening and/or -minifying CSS files because Change is doing it natively.

First, add vendor CSS path to your theme source code from *gulpconf.json* file. Example :

```json
{
  "css": {
    "vendor": [
      "src/vendor/bootstrap/dist/css/bootstrap.min.css"
    ]
  }
}
```

Then, don't forget to import vendor CSS from any SCSS file stored within the *src/style/* folder. Example :

```scss
@import url('/themes/'#{$theme}'/style/bootstrap-min.css');
```


### SASS files :

#### Import vendor SASS from *src/style/main.scss* file. Example :

```scss
@import "../vendor/bootstrap-sass/assets/stylesheets/bootstrap/alerts";
```

#### Use custom SASS styles :

Simply store your custom styles within the *src/style/* folder and use `@import` from *src/style/main.scss* file for them to be included.


Scripts
-------

Running `gulp script` will process all script tasks once; then stop.

### Use vendor JS :

Please note that Gulp `js:vendor` task is automatically replacing **.** characters with **-** in file names in order to meet RBS Change JS dependencies naming conventions.

Also, we don't care about Gulp-concatening JS files because Change is doing it natively.

#### Import vendor JS from *gulpconf.json* file. Example :

```json
{
  "js": {
    "vendor": [
      "src/vendor/browser-detection/src/browser-detection.js"
    ]
  }
}
```

### Use custom JS :

Simply store your custom JS within the *src/js/* folder and use [Change native functionnalities](http://wiki.rbschange.fr/start) to import their Gulp-processed versions from the *js/* folder.


Media
-----

Running `gulp media` will process all media tasks once; then stop. Media tasks consist in :
* custom fonts
* bitmap images (PNG, JPG, GIF)
* sprites :
  * bitmap images (PNG, JPG - no GIF support from gulp-spritesmith plugin) sprites
  * icon font
  * vector images (SVG) sprite


### Custom fonts

Put your custom fonts files within the source *scr/font/* folder. Then run `gulp font` to copy them in the destination *image/* folder.


### Bitmap images

Put your PNG, JPG or GIF files within the root of source *scr/image/* folder. Then run `gulp image` to send optimized versions to the destination *image/* folder.


### Sprites

#### Bitmap images (PNG, JPG) sprites

**Please note: GIF format is not supported by gulp-spritesmith plugin. Only use PNG or JPG files.**
You can create multiple sprites using one single task. Create one folder per sprite within the source *src/image/sprites/* folder. Do not mix multiple file formats within the same folder. Then run `gulp bitmap:sprite` to generate both a sprite per folder in the destination *image/* folder and a stylesheet per folder in the source *src/style/* folder. 

#### Icon font :

Put your SVG source files within the *src/iconfont/* folder. Then run `gulp iconfont` to generate both an iconfont in the *image/* folder and an *_iconfont.scss* in the *src/style/* folder.

HTML code to show an icon :
```html
<i class="iconfont iconfont-calendar"></i>
```

**Please note :** there's a whole lot of characters replacement going on for iconfonts within the gulpfile. That's because of Change 3.6.x CSS parser being picky with the double-quotes ("). You might not need the following when working with another CMS.

```js
gulp.task('sass', function() {
  gulp.src(config.paths.styles.src + '**/*.scss')
    .pipe(plugins.replace('"embedded-opentype', "'embedded-opentype'"))
    .pipe(plugins.replace('"woff2', "'woff2'"))
    .pipe(plugins.replace('"woff', "'woff'"))
    .pipe(plugins.replace('"truetype', "'truetype'"))
    .pipe(plugins.replace('"svg', "'svg'"))
    .pipe(gulp.dest(config.paths.styles.dest));
});
```

#### SVG sprites :

Put your SVG source files within the *src/image/sprites/svg/* folder. Then run `gulp svg:sprite` to generate the *modules/website/templates/Website-Block-Xhtmltemplate-Svgsprite.all.all.html* file which is already included in the starter theme's pages.

[Enjoy using your SVG icons the way Chris Coyier from css-tricks.com is decribing it](https://css-tricks.com/svg-sprites-use-better-icon-fonts/).


List of available Gulp tasks
----------------------------

### Default tasks
* `gulp` or `gulp default` : Process all tasks once; then stop
* `gulp watch` : Process all tasks; then continuously watch *src/* folder files for changes

### Global tasks
* `gulp style` : Process all style tasks once; then stop
* `gulp script` : Process all script tasks once; then stop
* `gulp media` : Process all media tasks once; then stop

### More specific tasks
* style
  * `gulp css:vendor` : Add vendor CSS to the source code 
  * `gulp sass` : SASS to CSS compilation (no CSS minification and/or concatenation as RBS Change already does it)
* script
  * `gulp js:vendor` or `gulp js:custom` : Vendor or custom JS minification (no JS concatenation as RBS Change already does it)
* media
  * `gulp font` : Copies custom font from source *src/font/* folder to destination */image* folder
  * `gulp image` : Bitmap images (PNG, JPG, GIF) compression
  * `gulp bitmap:sprite` : Generates bitmap (PNG or JPG - GIF not supported!) sprites and relative stylesheets
  * `gulp iconfont` : Generates an iconfont and relative stylesheet
  * `gulp svg:sprite` : Generates SVG sprite

### Clean
* `gulp style:clean` : Cleans destination */style* folder from deleted style source files
* `gulp script:clean` : Cleans destination *js* folder from deleted script source files
* `gulp media:clean` : Cleans destination */image* folder from deleted media source files


NPM font-blast
==============

**Extract individual SVG/PNG icons from vendor font libraries like Font Awesome/Foundation/Fontello/etc.**

Make sure your icon fonts libraries are added as dev dependencies within the bower.json file.

Then, run the following command from the root of your theme folder :
`node_modules/font-blast/bin/font-blast.js [source path to vendor icon font SVG file] [destination path to splitted SVG files]`

Example :
`node_modules/font-blast/bin/font-blast.js src/vendor/font-awesome/fonts/fontawesome-webfont.svg src/iconfont/lib/font-awesome/splitted/`
