var gulp = require("gulp"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    bulkSass = require('gulp-sass-bulk-import'),
    pug = require("gulp-pug"),
    concat = require("gulp-concat"),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    minify = require('gulp-minify'),
    pump = require('pump');

/**
 * SASS
 */
gulp.task("sass", function() {
    return gulp.src(["./styles/app.scss", "./styles/works.scss"])
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
    return gulp.src(["./templates/*.pug", "./templates/pages/*.pug"])
        .pipe(pug())
        .pipe(gulp.dest("."));
});

/**
 * UGLIFY
 */
gulp.task('uglify', function(){
  gulp.src('./js/modules/database.js')
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(uglify().on('error', function(e){
        console.log(e);
     }))
    .pipe(gulp.dest('./js'));
});

/**
 * Scripts
 */
gulp.task("scripts", function() {
    return gulp.src(["./js/modules/global.js",
            "./js/modules/scroll.js",
            "./js/modules/header.js",
            "./js/modules/menu.js",
            "./js/modules/skills.js",
            "./js/modules/social.js",
            "./js/modules/parallax.js",
            "./js/modules/email.js",
            "./js/modules/slider.js",
            "./js/database.js"
        ])
        .pipe(concat("app.js"))
        .pipe(gulp.dest("./js"));
});

gulp.task("default", ["sass", "pug", "uglify", "scripts"]);