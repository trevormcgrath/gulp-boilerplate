#Basic Gulp Boilerplate + SCSS Compiling

This is a basic gulp boilerplate for small static html projects. 

##Features
* SCSS compiling
* Build Task
* Automatic Project Backup
* Minify JavaScript & CSS files
* Browser-sync

##Installation
Navigate to the location of where you would like to store this repository in the terminal then proceed to the commands below.

```markup
    $ git clone https://github.com/ChynoDeluxe/gulp-boilerplate.git
    $ cd gulp-boilerplate
    $ npm install
```
**Install Gulp Globally**
```markup
    $ [sudo] npm install gulp -g
```

##Usage
To start developing your project you simply need to run the `gulp` command

```markup
    $ gulp
```

Backups of your project will automatically be created every 4 saves but can be changed by altering the `savesUntilBackup` variable in the **gulpfile.js**.

###Build Task
Once your project is ready to be deployed you can run the `gulp build` task to generate a distribution folder including both minified and un-minified JavaScript and CSS files.

```markup
    $ gulp build
```

##devDependencies

* ["browser-sync": "^2.8.0"](https://wwwgulp.npmjs.com/package/browser-sync)
* ["del": "^2.2.0"](https://www.npmjs.com/package/del)
* ["gulp": "^3.9.0"](https://www.npmjs.com/package/gulp)
* ["gulp-clean-css": "^2.0.6"](https://www.npmjs.com/package/gulp-clean-css)
* ["gulp-rename": "^1.2.2"](https://www.npmjs.com/package/gulp-rename)
* ["gulp-sass": "^2.0.4"](https://www.npmjs.com/package/gulp-sass)
* ["gulp-sourcemaps": "^1.5.2"](https://www.npmjs.com/package/gulp-sourcemaps)
* ["gulp-uglify": "^1.5.3"](https://www.npmjs.com/package/gulp-uglify)