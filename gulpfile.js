'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    //    watch = require('gulp-watch'),
    browserSync = require('browser-sync').create(),
    del = require('del'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    cleanCSS = require('gulp-clean-css');

var src = {
    app: './app/',
    dist: './dist/',
    backup: './backup/',
    css: 'assets/css/',
    js: 'assets/js/',
    scss: 'assets/scss/'
}

var backupTime = 120000;

//BROSWER SYNC + WATCH SASS FILES
gulp.task('serve', ['sass'], function () {
    browserSync.init({
        server: src.app
    })
    gulp.watch(src.app + src.scss + '*.scss', ['sass']);
    gulp.watch([src.app + '*.html', src.app + src.js + '*.js']).on('change', browserSync.reload);
});

//COMPILE SASS/SCSS FILES TO CSS
gulp.task('sass', function () {
    gulp.src(src.app + src.scss + 'main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(src.app + src.css))
        .pipe(browserSync.stream());
});

//DISTRIBUTION TASK
gulp.task('build', ['clean', 'build:html', 'build:css', 'build:js', 'minify']);

//DELETE PREVIOUS DIST FOLDER
gulp.task('clean', function () {
    del.sync(src.dist);
});
//COPY HTML FILES TO DIST FOLDER
gulp.task('build:html', function () {
    gulp.src(src.app + '*.html')
        .pipe(gulp.dest(src.dist));
});
//COPY COMPILED CSS FILES TO DIST FOLDER
gulp.task('build:css', function () {
    gulp.src(src.app + src.css + '*.css')
        .pipe(gulp.dest(src.dist + src.css));
});
//COPY JAVASCRIPT FILES TO DIST FOLDER
gulp.task('build:js', function () {
    gulp.src(src.app + src.js + '*.js')
        .pipe(gulp.dest(src.dist + src.js));
});

//MINIFIY TASK
gulp.task('minify', ['minify:js', 'minify:css']);
//MINIFY JAVASCRIPT
gulp.task('minify:js', function () {
    gulp.src(src.app + src.js + '*.js')
        .pipe(uglify())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest(src.dist + src.js));
});
//MINIFY CSS
gulp.task('minify:css', function () {
    gulp.src(src.app + src.css + '*.css')
        .pipe(cleanCSS())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest(src.dist + src.css));
});

//BACKUP APP FOLDER
gulp.task('backup', function () {
    function backup() {
        del.sync(src.backup);
        gulp.src(src.app + '**/*')
            .pipe(gulp.dest('./backup'));
        console.log("Project Backed up " + new Date());
    }
    backup();
    //BACKUP AUTOMATICALLY AFTER DURATION
    setInterval(backup, backupTime);
});

//DEFAULT TASK
gulp.task('default', ['serve', 'backup']);