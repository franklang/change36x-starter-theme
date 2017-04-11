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

Anything outside that *./src* folder might be lost either by not being watched by Git (see *.gitignore* file) or by being erased next time a Gulp task is re-launched. 


### Use vendor styles :

Import vendor styles from *./src/style/main.scss* file. Example :

```scss
@import "../vendor/bootstrap-sass/assets/stylesheets/bootstrap";
```


### Use custom styles :

Simply store your custom styles within the *./src/style/* folder and use `@import` from *./src/style/main.scss* file.


### Use vendor JS :

Import vendor JS from *./gulpfonf.json* file. Example :

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


List of available Gulp tasks
----------------------------

* `gulp style` : SASS to CSS compilation (no CSS minification and/or concatenation as RBS Change already does it)
* `gulp js:vendor` or `gulp js:custom` : Vendor or custom JS minification (no JS concatenation as RBS Change already does it)
* `gulp svg:sprite` : SVG sprite generation
* `gulp image` : Image compression
* `gulp watch` : Process'em all; this task never stops and continuously watches *./src* folder for changes