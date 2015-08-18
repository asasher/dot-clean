var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var tsify = require('tsify');

gulp.task('js', function () {
    browserify()
        .add('src/main.ts')
        .plugin('tsify')
        .bundle()
        .on('error', function (error) { console.error(error.toString()); })
        .pipe(source('main.js'))
        .pipe(gulp.dest('bin/js'));
});

gulp.task('js-watch', ['js'], function() {
    browserSync.reload();
});

gulp.task('serve', ['js'], function () {
    browserSync.init({
        server: {
            baseDir: "./bin/"
        },
        reloadDelay: 2000
    });
    gulp.watch('src/**/*.ts', ['js-watch']);
});