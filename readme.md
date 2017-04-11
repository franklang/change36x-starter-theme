RBS Change 3.6.x starter theme
==============================

Requirements
------------

* [NodeJS is installed](https://docs.npmjs.com/getting-started/installing-node)
* [Bower is installed](https://bower.io/)
 

Theme initialization and update
-------------------------------

Whenever you've just grabbed this starter bundle from GitHub and want to start a fresh theme development or just ran a `git pull` to get last code updates from your team, **always do the following** to make sure you have an up to date list of dependencies and packages :

* Run `bower install` to get or update theme front-end dependencies list
* Run `npm install` to get or update NodeJS packages list (essentially Gulp plugins)


Bower + Gulp workflow
---------------------

### Files of interest :

* **bower.json**
* **package.json** : list of Gulp plugins to be used.
* **gulpconf.json**
* **gulpfile.js**


### Use vendor styles :



### Use vendor JS :


### List of available Gulp commands :

* `gulp style` : SASS to CSS compilation (no CSS minification and/or concatenation as RBS Change already does it)
* `gulp js:vendor` or `gulp js:custom` : Vendor or custom JS minification (no JS concatenation as RBS Change already does it)
* `gulp svg:sprite` : SVG sprite generation
* `gulp image` : Image compression
* `gulp watch` : Process'em all; this task never stops and continuously watches *./src* folder for changes