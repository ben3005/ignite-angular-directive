var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var rimraf = require("rimraf");
var uglify = require("gulp-uglify");
var merge = require('merge-stream');
var config = require('./gulp.config')();
var del = require('del');
var $ = require('gulp-load-plugins')({ lazy: true });
var colors = $.util.colors;

var paths = {
    sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function (done) {
    return gulp
        .src(config.sass)
        .pipe(sass({
            includePaths: ['./' + config.bower.directory + 'ionic/scss'],
            errorLogToConsole: true
        }))
        .pipe(gulp.dest(config.demo +'css'));
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
});

gulp.task('clean-demo', function () {
    return del(config.demo + 'js/**/*');
});

gulp.task('copy-src', ['clean-demo'] ,function () {
    return gulp
        .src(config.allsrc)
        .pipe(gulp.dest(config.demo + 'js/'));
});

/*
 * IMPORTED STUFF
 * 
 */

gulp.task('default', ['help']);
gulp.task('help', $.taskListing);


gulp.task('inject', ['sass', 'copy-src'], function () {
    log('Wire up css into the html, after files are ready');

    var wiredep = require('wiredep');
    var options = config.getWiredepDefaultOptions();

    var copyBowerLibaries =
        gulp.src(wiredep(options).js)
        .pipe(gulp.dest(config.demo + 'lib/'));

    var inject = gulp
        .src(config.index)
        .pipe(wiredep.stream(options))
        .pipe($.inject(gulp.src(config.js), config.getInjectJSOptions()))
        .pipe($.inject(gulp.src(config.css), config.getInjectCSSOptions()))
        .pipe(gulp.dest(config.destIndex));

    return merge(inject, copyBowerLibaries);
});

/**
 * Build everything
 * This is separate so we can run tests on
 * optimize before handling image or fonts
 */
gulp.task('build', ['optimize', 'fonts'], function () {
    log('Building everything');

    var msg = {
        title: 'gulp build',
        subtitle: 'Deployed to the build folder',
        message: 'Running `gulp serve-build`'
    };
    del(config.temp);
    log(msg);
    notify(msg);
});

/**
 * Optimize all files, move to a build folder,
 * and inject them into the new index.html
 * @return {Stream}
 */
gulp.task('optimize', ['inject'], function () {
    log('Optimizing the js, css, and html');

    var assets = $.useref.assets({ searchPath: './' });
    // Filters are named for the gulp-useref path
    var cssFilter = $.filter('**/*.css');
    var jsAppFilter = $.filter('**/' + config.optimized.app);
    var jslibFilter = $.filter('**/' + config.optimized.lib);

    var templateCache = config.temp + config.templateCache.file;

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe($.inject(gulp.src(templateCache),
            { name: 'inject:templates', read: false }))
        .pipe(assets) // Gather all assets from the html with useref
        // Get the css
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore())
        // Get the custom javascript
        .pipe(jsAppFilter)
        .pipe($.ngAnnotate({ add: true }))
        .pipe($.uglify())
        .pipe(getHeader())
        .pipe(jsAppFilter.restore())
        // Get the vendor javascript
        .pipe(jslibFilter)
        .pipe($.uglify()) // another option is to override wiredep to use min files
        .pipe(jslibFilter.restore())
        // Take inventory of the file names for future rev numbers
        .pipe($.rev())
        // Apply the concat and file replacement with useref
        .pipe(assets.restore())
        .pipe($.useref())
        // Replace the file names in the html with rev numbers
        .pipe($.revReplace())
        .pipe(gulp.dest(config.build));
});

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

/**
 * Format and return the header for files
 * @return {String}           Formatted file header
 */
function getHeader() {
    var pkg = require('./package.json');
    var template = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @authors <%= pkg.authors %>',
        ' * @version v<%= pkg.version %>',
        ' * @link <%= pkg.homepage %>',
        ' * @license <%= pkg.license %>',
        ' */',
        ''
    ].join('\n');
    return $.header(template, {
        pkg: pkg
    });
}

/**
 * Delete all files in a given path
 * @param  {Array}   path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}