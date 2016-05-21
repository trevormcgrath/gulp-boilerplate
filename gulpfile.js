'use strict';

var browserSync = require('browser-sync').create(),
    cleanCSS = require('gulp-clean-css'),
    del = require('del'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    zip = require('gulp-zip');

//CACHE FOLDER LOCATIONS
var src = {
    lib: './lib/',
    dist: './dist/',
    backup: './lib_backup/',
    archive: './lib_archive/',
    css: 'assets/css/',
    js: 'assets/js/',
    scss: 'assets/scss/'
};

//INIT SAVE COUNT
var saveCount = 0,
    //SAVES BEFORE BACKUP
    savesUntilBackup = 4,
    //SAVES BEFORE ZIP
    savesUntilZip = 10;

/*================================
    BROSWER SYNC + WATCH TASK
================================*/
gulp.task('serve', ['sass'], function () {
    //INIT LOCAL SERVER
    browserSync.init({
        //SERVER ROOT FOLDER
        server: src.lib
    });
    //WATCH FOR CHANGES TO SCSS, HTML AND JS FILES AND RUN BACKUP
    gulp.watch(src.lib + src.scss + '**/*.scss', ['sass', 'backup']);
    gulp.watch(src.lib + '*.html', ['backup']).on('change', browserSync.reload);
    gulp.watch(src.lib + src.js + '*.js', ['backup']).on('change', browserSync.reload);
});

/*================================
    SASS TASK
================================*/
gulp.task('sass', function () {
    //LOCATE MAIN.SCSS FILE
    return gulp.src(src.lib + src.scss + 'main.scss')
        //INIT SOURCEMAPS
        .pipe(sourcemaps.init())
        //COMPILE SCSS IF NO ERROR
        .pipe(sass().on('error', sass.logError))
        //WRITE SOURCEMAPS FOR COMPILED SCSS
        .pipe(sourcemaps.write())
        //MOVE COMPILED SCSS TO CSS FOLDER
        .pipe(gulp.dest(src.lib + src.css))
        //RELOAD SERVER
        .pipe(browserSync.stream());
});
/*================================
    DISTRIBUTION TASK
================================*/
gulp.task('deploy', ['clean', 'build', 'minify']);

//CLEAN
gulp.task('clean', function () {
    //DELETE DIST FOLDER
    del.sync(src.dist);
});

//BUILD
gulp.task('build', function () {
    return gulp.src([
        //LOCATE LIB FOLDER
        src.lib + '**',
        //EXLCUDE SCSS FOLDER
        '!' + src.lib + src.scss,
        //EXCLUDE SCSS FILES
        '!' + src.lib + src.scss + '**/*'
    ])
        //COPY TO DIST FOLDER
        .pipe(gulp.dest(src.dist))
});

/*================================
    MINIFIY TASK
================================*/
gulp.task('minify', ['minify:js', 'minify:css']);

//MINIFY JAVASCRIPT
gulp.task('minify:js', function () {
    //LOCATE JS FILES IN LIB JS FOLDER
    return gulp.src(src.lib + src.js + '*.js')
        //MINIFY
        .pipe(uglify())
        //RENAME WITH .MIN.JS PREFIX
        .pipe(rename('main.min.js'))
        //MOVE TO DIST FOLDER
        .pipe(gulp.dest(src.dist + src.js));
});
//MINIFY CSS
gulp.task('minify:css', function () {
    //LOCATE CSS FILES IN LIB FOLDER
    return gulp.src(src.lib + src.css + '*.css')
        //MINIFY
        .pipe(cleanCSS())
        //RENAME WITH .MIN.CSS PREFIX
        .pipe(rename('main.min.css'))
        //MOVE TO DIST FOLDER
        .pipe(gulp.dest(src.dist + src.css));
});

/*================================
    BACKUP TASK
================================*/

gulp.task('backup', function () {
    //INIT BACKUP MESSAGE
    var backupMessage = "",

        //CACHE CURRENT DATE INFO
        date = new Date(),
        month = date.getMonth(),
        day = date.getDate(),
        year = date.getFullYear(),
        hour = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds();

    //GET CURRENT DATE FOR FOLDER NAMING
    function getDate() {
        //CHECK IF NUM IS LESS THAN 10
        function isLessThan10(num) {
            return num < 10;
        }
        //ADD ZERO BEFORE NUM
        function addZero(num) {
            return "0" + num;
        }
        //BUILD DATE STRING
        var dateTime = "_";
        //IF MONTH IS LESS THAN 10, ADD ZERO, ELSE MONTH
        dateTime += isLessThan10(month) ? addZero(month) : month;
        //IF DAY LESS THAN 10, ADD ZERO, ELSE DAY
        dateTime += isLessThan10(day) ? addZero(day) : day;
        //YEAR
        dateTime += year;
        dateTime += "_";
        //IF HOUR IS LESS THAN 10, ADD ZERO, IF HOUR IS GREATER THAN 12, MINUS 12, ELSE HOUR
        dateTime += isLessThan10(hour) ? addZero(hour) : (hour > 12 ? hour - 12 : hour);
        //IF MINUTES IS LESS THAN 10, ADD ZERO, ELSE MINUTES
        dateTime += isLessThan10(minutes) ? addZero(minutes) : minutes;
        //IF SECONDS IS LESS THAN 10, ADD ZERO, ELSE SECONDS
        dateTime += isLessThan10(seconds) ? addZero(seconds) : seconds;

        return dateTime;
    }

    function backup() {
        //CONSOLE LOG BACKUP MESSAGE AND DATE
        function logDate() {
            backupMessage = "===============================\n\n";
            backupMessage += "Project Backed up \n" + new Date();
            backupMessage += "\n\n===============================";
            console.log(backupMessage);
        }

        //LOCATE LIB FOLDER
        gulp.src(src.lib + '**/*')
            //COPY TO BACKUP FOLDER WITH DATE
            .pipe(gulp.dest(src.backup + getDate()));
        //LOG DATE OF BACKUP
        logDate();
    }

    function zipBackups() {
        console.log("Backup folder was Archived");

        gulp.src(src.backup + '**')
            //ZIP BACKUPS
            .pipe(zip(getDate() + '.zip'))
            //COPY TO DIST FOLDER
            .pipe(gulp.dest(src.archive))
            .on('end', function () {
                del.sync(src.backup);
            });
    }

    //BACKUP AUTOMATICALLY AFTER SAVECOUNT  
    if (saveCount % savesUntilBackup === 0) {
        backup();
    } else if (saveCount % savesUntilZip === 0) {
        zipBackups();
    }

    saveCount += 1;

});

/*================================
    DEFAULT TASK
================================*/
gulp.task('default', ['serve', 'backup']);