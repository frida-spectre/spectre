var gulp = require('gulp');
var browserify = require('browserify');
var ts = require('gulp-typescript');
var source = require('vinyl-source-stream');
var merge = require('merge-stream');
var tsconfig = require('tsconfig-glob');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');

gulp.task('default', function(callback) {
    runSequence(
        'clean',
        'tsconfig-glob',
        'compile-typescript'
    );
});

gulp.task('compile-typescript', function() {
    var tsProject = ts.createProject('tsconfig.json');
    var tsResult = tsProject.src().pipe(ts(tsProject));
    return merge([
        tsResult.js.pipe(gulp.dest('./dist')),
        tsResult.dts.pipe(gulp.dest('./dist')),
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
    return gulp.src('./dist')
        .pipe(clean());
});