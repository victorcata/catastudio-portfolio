var gulp = require("gulp"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    bulkSass = require('gulp-sass-bulk-import'),
    pug = require("gulp-pug");

/**
 * SASS
 */
gulp.task("sass", function() {
    return gulp.src("./styles/app.scss")
               .pipe(sourcemaps.init())
               .pipe(bulkSass())
               .pipe(sass().on("error", sass.logError))
               .pipe(sourcemaps.write())
               .pipe(gulp.dest("./styles"));
});

/**
 * SASS Watcher
 */
gulp.task("sass:watch", function() {
    gulp.watch("./styles/**/*.scss", ["sass"]);
});

/**
 * PUG
 */
gulp.task("pug", function() {
    return gulp.src("./templates/index.pug")
               .pipe(pug())
               .pipe(gulp.dest("."));
});


gulp.task("default", ["sass", "pug"]);