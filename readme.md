RBS Change 3.6.x starter theme
==============================

Requirements
------------

* [Install nodeJS](https://docs.npmjs.com/getting-started/installing-node)
* [Install Bower](https://bower.io/)
 

Theme initialization and update
-------------------------------

Whenever you've just grabbed this theme from Github and want to start a new theme [TODO]

* Run `bower install` to grab (1st time) or update theme front-end dependencies list
* Run `npm install` to grab (1st time) or update nodeJS packages list (essentially Gulp plugins)


Bower + Gulp workflow
---------------------

### Files of interest :

* **bower.json**
* **package.json** : list of Gulp plugins to be used.
* **gulpconf.json**
* **gulpfile.js**

### Use vendor JS :


### List of available Gulp command :

* `gulp style` : SASS to CSS compilation (no CSS minification and/or concatenation as RBS Change already does it)
* `gulp js:vendor` or `gulp js:custom` : Vendor or custom JS minification (no JS concatenation as RBS Change already does it)
* `gulp svg:sprite` : SVG sprite generation
* `gulp image` : Image compression
* `gulp watch` : Process'em all; this task never stops and continuously watches *./src* folder for changes