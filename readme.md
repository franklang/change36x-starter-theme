RBS Change 3.6.x starter theme
==============================

**See list of available Gulp tasks at the end of this readme file.**


Requirements
------------

* [NodeJS installed](https://docs.npmjs.com/getting-started/installing-node)
* [Bower installed](https://bower.io/)
 

Theme initialization and update
-------------------------------

Clone this repo: `git clone -b base-workflow https://github.com/franklang/change36x-starter-theme.git`.

Whenever you've just grabbed this starter bundle from GitHub and want to start a fresh theme development or just ran a `git pull` to get latest code updates from your team, **always do the following** to make sure you have an up-to-date list of installed dependencies and packages :

* Run `bower install` to get or update theme front-end dependencies list
* Run `npm install` to get or update NodeJS packages list (essentially Gulp plugins)


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

First thing to do: set `"theme"` value from the *gulpconf.json* to your theme name (default value is `starter`).

Also, rush over *src/style/main.scss* and set `$theme` variable value to your theme name too (default value is `starter`).


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
* bitmap images (PNG, JPG - no GIF support) sprites
* icon font
* vector (SVG) sprite


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
