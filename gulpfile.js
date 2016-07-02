var gulp = require('gulp');
var browserify = require('browserify');
var ts = require('gulp-typescript');
var source = require('vinyl-source-stream');
var merge = require('merge-stream');
var tsconfig = require('tsconfig-glob');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var sourceMaps = require('gulp-sourcemaps');

gulp.task('default', function(callback) {
    runSequence(
        'clean',
        'tsconfig-glob',
        'compile-typescript'
    );
});

gulp.task('compile-typescript', function() {
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = tsProject.src()
        .pipe(sourceMaps.init())
        .pipe(ts(tsProject));
    return merge([
        tsResult.js
            .pipe(sourceMaps.write())
            .pipe(gulp.dest('./build/ts-compiled')),
        tsResult.dts.pipe(gulp.dest('./build/ts-compiled')),
    ]);
});

gulp.task('browserify', function() {
    var bundle = browserify('./build/src/spectre.js').bundle();
    return bundle.pipe(source('bundle.js'))
        .pipe(gulp.dest('./build/js'));
});

gulp.task('tsconfig-glob', function() {
    return tsconfig({
        configPath: '.',
        indent: 4
    });
});

gulp.task('clean', function() {
    var distClean = gulp.src('./dist').pipe(clean());
    var buildClean = gulp.src('./build').pipe(clean());
    return merge([
        distClean,
        buildClean
    ])
});