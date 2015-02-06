var gulp        = require('gulp'),
    taskListing = require('gulp-task-listing'),
    $           = require('gulp-load-plugins')(),
    minify      = require('gulp-minify-css'),
    pagespeed   = require('psi'),
    browserSync = require('browser-sync');

var publicPath = './public';
var config = {
    url      : "",
    lessPath : publicPath + '/less',
    cssPath  : publicPath + '/css',
    jsPath   : publicPath + '/js',
    iconPath : publicPath + '/fonts',
    bowerDir : './library'
};

gulp.task('help', taskListing);
gulp.task('default', ['install']);
gulp.task('install', ['dist']);
gulp.task('compile', ['compile-less']);
gulp.task('test', ['test-lint']);

/**********************************************/
/************* Dist build *********************/
gulp.task('dist', ['dist-bower', 'dist-icons']);
gulp.task('dist-bower', function () {
    $.bower()
        .pipe(gulp.dest(config.bowerDir));
});
gulp.task('dist-icons', ['bower'], function () {
    gulp.src(config.bowerDir + '/fontawesome/fonts/**.*')
        .pipe(gulp.dest(config.iconPath));
});
/**********************************************/
/**********************************************/

/**********************************************/
/********** Page speed test *******************/
gulp.task('test-pagespeed', ['test-pagespeed-mobile', 'test-pagespeed-desktop']);
gulp.task('test-pagespeed-mobile', function () {
    pagespeed.output(config.url, {
        strategy: 'mobile'
    }, function (err) {
        if (err) {
            console.error(err);
        }
    });
});
gulp.task('test-pagespeed-desktop', function () {
    pagespeed.output(config.url, {
        strategy: 'desktop'
    }, function (err) {
        if (err) {
            console.error(err);
        }
    });
});
/**********************************************/
/**********************************************/

/**********************************************/
/************* Lint test **********************/
gulp.task('test-lint', ['test-lint-css', 'test-lint-js']);
gulp.task('test-lint-css', function () {
    gulp.src([config.cssPath  + '/*.css'])
        .pipe($.csslint())
        .pipe($.notify({
            message: "CSS Lint file: <%= file.relative %>",
            templateOptions: {}
        }))
        .pipe($.csslint.reporter());
});
gulp.task('test-lint-js', function () {
    gulp.src([config.jsPath + "/*.js"])
        .pipe(browserSync.reload({stream: true, once: true}))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.jscs({esnext: true}))
        .pipe($.notify({
            message: "JS Lint file: <%= file.relative %>",
            templateOptions: {}
        }))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});
/**********************************************/
/**********************************************/

/**********************************************/
/************* Validation *********************/
gulp.task('test-validation', ['test-validation-html']);
gulp.task('test-validation-html', function () {
    gulp.src(publicPath  + '/*.html')
        .pipe($.w3cjs())
        .pipe($.notify({
            message: "HTML Validator: <%= file.relative %>",
            templateOptions: {}
        }));
});
/**********************************************/
/**********************************************/

/**********************************************/
/************* Compilation ********************/
gulp.task('compile-less', function () {
    gulp.src([config.lessPath + '/*.less'])
        .pipe($.less())
        .pipe(minify({keepSpecialComments : 0}))
        .pipe(gulp.dest(config.cssPath))
        .pipe($.notify({
            message: "Compilation file: <%= file.relative %>",
            templateOptions: {}
        }));
});
/**********************************************/
/**********************************************/

gulp.task('watch', function () {
    gulp.watch(config.lessPath + '/*.less', ['compile-less']);
    gulp.watch(config.cssPath  + '/*.css', ['test-lint-css']);
    gulp.watch(publicPath + '/*.html', ['test-validation-html']);
});
