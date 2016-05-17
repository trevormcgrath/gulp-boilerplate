'use strict';

var browserSync = require('browser-sync').create(),
    cleanCSS = require('gulp-clean-css'),
    del = require('del'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify');

var src = {
    app: './app/',
    dist: './dist/',
    backup: './backup/',
    css: 'assets/css/',
    js: 'assets/js/',
    scss: 'assets/scss/'
};

var saveCount = 0,
    savesUntilBackup = 4;

/*================================
    BROSWER SYNC + WATCH TASK
================================*/
gulp.task('serve', ['sass'], function () {
    browserSync.init({
        server: src.app
    });
    gulp.watch(src.app + src.scss + '**/*.scss', ['sass', 'backup']);
    gulp.watch(src.app + '*.html',['backup']).on('change', browserSync.reload);
    gulp.watch(src.app + src.js + '*.js', ['backup']).on('change', browserSync.reload);
});

/*================================
    SASS TASK
================================*/
gulp.task('sass', function () {
    gulp.src(src.app + src.scss + 'main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(src.app + src.css))
        .pipe(browserSync.stream());
});
/*================================
    DISTRIBUTION TASK
================================*/
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

/*================================
    MINIFIY TASK
================================*/
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

/*================================
    BACKUP TASK
================================*/

gulp.task('backup', function () {
    console.log("Project was saved " + saveCount + " times");

    function backup() {
        del.sync(src.backup);
        gulp.src(src.app + '**/*')
            .pipe(gulp.dest('./backup'));
        console.log("Project Backed up " + new Date());
    }
    //BACKUP AUTOMATICALLY AFTER SAVECOUNT    
    if (saveCount === savesUntilBackup) {
        saveCount = 0;
        backup();
    } else {
        saveCount += 1;
    }

});

/*================================
    DEFAULT TASK
================================*/
gulp.task('default', ['serve', 'backup']);