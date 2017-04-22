var gulp = require("gulp"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    bulkSass = require('gulp-sass-bulk-import');

gulp.task("sass", function() {
    return gulp.src("./styles/app.scss")
               .pipe(sourcemaps.init())
               .pipe(bulkSass())
               .pipe(sass().on("error", sass.logError))
               .pipe(sourcemaps.write())
               .pipe(gulp.dest("./styles"));
});

gulp.task("sass:watch", function() {
    gulp.watch("./styles/**/*.scss", ["sass"]);
});

gulp.task("default",["sass"]);