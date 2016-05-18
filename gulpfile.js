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
    lib: './lib/',
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
        server: src.lib
    });
    gulp.watch(src.lib + src.scss + '**/*.scss', ['sass', 'backup']);
    gulp.watch(src.lib + '*.html', ['backup']).on('change', browserSync.reload);
    gulp.watch(src.lib + src.js + '*.js', ['backup']).on('change', browserSync.reload);
});

/*================================
    SASS TASK
================================*/
gulp.task('sass', function () {
    gulp.src(src.lib + src.scss + 'main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(src.lib + src.css))
        .pipe(browserSync.stream());
});
/*================================
    DISTRIBUTION TASK
================================*/
gulp.task('deploy', ['clean', 'build', 'minify']);

//DELETE PREVIOUS DIST FOLDER
gulp.task('clean', function () {
    del.sync(src.dist);
});

//COPY LIB FOLDER TO DIS FOLDER BUT EXCLUDE SCSS FOLDER
gulp.task('build', function () {
    gulp.src([src.lib + '**', '!' + src.lib + src.scss, '!' + src.lib + src.scss + '**/*'])
        .pipe(gulp.dest(src.dist))
});

/*================================
    MINIFIY TASK
================================*/
gulp.task('minify', ['minify:js', 'minify:css']);
//MINIFY JAVASCRIPT
gulp.task('minify:js', function () {
    gulp.src(src.lib + src.js + '*.js')
        .pipe(uglify())
        .pipe(rename('main.min.js'))
        .pipe(gulp.dest(src.dist + src.js));
});
//MINIFY CSS
gulp.task('minify:css', function () {
    gulp.src(src.lib + src.css + '*.css')
        .pipe(cleanCSS())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest(src.dist + src.css));
});

/*================================
    BACKUP TASK
================================*/

gulp.task('backup', function () {
    var backupMessage = "",
        date = new Date(),
        month = date.getMonth(),
        day = date.getDate(),
        year = date.getFullYear(),
        hour = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds();

    function isLessThan10(num) {
        return num < 10;
    }

    function addZero(num) {
        return "0" + num;
    }

    function getDate() {
        var dateTime = "_";
        dateTime += isLessThan10(month) ? addZero(month) : month;
        dateTime += isLessThan10(day) ? addZero(day) : day;
        dateTime += year;
        dateTime += "_";
        dateTime += isLessThan10(hour) ? addZero(hour) : (hour > 12 ? hour - 12 : hour);
        dateTime += isLessThan10(minutes) ? addZero(minutes) : minutes;
        dateTime += isLessThan10(seconds) ? addZero(seconds) : seconds;

        return dateTime;
    }

    function backup() {
        //        del.sync(src.backup);
        gulp.src(src.lib + '**/*')
            .pipe(gulp.dest('./backup/' + getDate()));

        backupMessage = "===============================\n\n";
        backupMessage += "Project Backed up \n" + new Date();
        backupMessage += "\n\n===============================";

        console.log(backupMessage);
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