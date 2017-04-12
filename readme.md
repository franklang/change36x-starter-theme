RBS Change 3.6.x starter theme
==============================

Requirements
------------

* [NodeJS is installed](https://docs.npmjs.com/getting-started/installing-node)
* [Bower is installed](https://bower.io/)
 

Theme initialization and update
-------------------------------

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
1. **must** be stored within the *./src* folder
2. **must** be processed using Gulp.

Anything outside that *./src* folder might be lost by either being ignored by Git (see *.gitignore* file) or erased next time a Gulp task is run. 


### Use vendor styles :

#### CSS files :

Please note that Gulp `css:vendor` task is automatically replacing **.** caracters with **-** in file names in order to meet RBS Change CSS dependencies naming conventions.

Rush over *./src/style/main.scss* and set `$theme` variable value to your theme name (default value: `starter`).

##### Import vendor CSS from *./gulpconf.json* file. Example :

```json
{
  "css": {
    "vendor": [
      "./src/vendor/bootstrap/dist/css/bootstrap.min.css"
    ]
  }
}
```

##### Import vendor CSS from file. Example :

```scss
@import url('/themes/' + $theme + '/style/bootstrap-min.css');
```

### SASS files :

#### Import vendor SASS from *./src/style/main.scss* file. Example :

```scss
@import "../vendor/bootstrap-sass/assets/stylesheets/bootstrap/alerts";
```


#### Use custom SASS styles :

Simply store your custom styles within the *./src/style/* folder and use `@import` from *./src/style/main.scss* file.


### Use vendor JS :

Please note that Gulp `js:vendor` task is automatically replacing **.** caracters with **-** in file names in order to meet RBS Change JS dependencies naming conventions.

#### Import vendor JS from *./gulpconf.json* file. Example :

```json
{
  "js": {
    "vendor": [
      "./src/vendor/browser-detection/src/browser-detection.js"
    ]
  }
}
```


### Use custom JS :

Simply store your custom JS within the *./src/js/* folder and use [Change native functionnalities](http://wiki.rbschange.fr/start) to import their Gulp-processed versions from the *./js/* folder.


### SVG sprites :

Put your SVG source files within the *./src/image/sprite/svg/* folder. Then run `gulp svg:sprite` to generate the *./modules/website/templates/Website-Block-Xhtmltemplate-Svgsprite.all.all.html* file which is already included in the starter theme's pages.

[Enjoy using your SVG icons the way Chris Coyier from css-tricks.com is decribing it](https://css-tricks.com/svg-sprites-use-better-icon-fonts/).


List of available Gulp tasks
----------------------------

* `gulp style` : SASS to CSS compilation (no CSS minification and/or concatenation as RBS Change already does it)
* `gulp js:vendor` or `gulp js:custom` : Vendor or custom JS minification (no JS concatenation as RBS Change already does it)
* `gulp svg:sprite` : SVG sprite generation
* `gulp image` : Image compression
* `gulp watch` : Process'em all; this task never stops and continuously watches *./src* folder for changes