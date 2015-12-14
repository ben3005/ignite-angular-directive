module.exports = function () {
    var src = 'src/';
    var demo = 'www/';
    var root = './';
    var wiredep = require('wiredep');
    var bowerFiles = wiredep({ devDependencies: true })['js'];

    var config = {
        allsrc: [
            src + '**/*.html',
            src + '**/*.js'
        ],
        src: src,
        demo: demo,
        css: [
            root + 'css/**/*.css',
            demo + 'css/**/*.css'
        ],
        exclude: ['angular.js', 'angular-animate.js', 'angular-sanitize.js', 'angular-ui-router.js'],
        html: demo + '**/*.html',
        index: demo + 'index.html',
        destIndex: demo,
        // app js, with no specs
        js: [
             demo + '**/*.module.js',
             demo + '**/*.js',
             '!' + demo + '**/*.spec.js',
             '!' + demo + '/lib/**/*.js'
        ],
        root: root,
        sass: src + 'scss/app.scss',
        /**
         * optimized files
         */
        optimized: {
            app: 'app.js',
            lib: 'lib.js'
        },
        /**
         * template cache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app.core',
                root: 'app/',
                standAlone: false,
            }
        },
        /**
         * Bower and NPM locations
         */
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../'
        },
        packages: [
            './package.json',
            './bower.json'
        ],

    };

    /**
     * wiredep and bower settings
     */
    config.getWiredepDefaultOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath,
            exclude: config.exclude,
            fileTypes: {
                html: {
                    replace: {
                        js: function (filePath) {
                            return '<script src="' + 'lib/' + filePath.split('/').pop() + '"></script>';
                        },
                        css: function (filePath) {
                            return '<link rel="stylesheet" href="' + 'lib/' + filePath.split('/').pop() + '"/>';
                        }
                    }
                }
            }
        };
        return options;
    };

    config.getInjectJSOptions = function () {
        var options = {
            transform: function (filePath, file, i, length) {
                return '<script src="' + filePath.replace('/www/','') + '"></script>';
            }
        };

        return options;
    };

    config.getInjectCSSOptions = function () {
        var options = {
            transform: function (filePath, file, i, length) {
                return '<link rel="stylesheet" href="' + filePath.replace('/www/', '') + '"/>';
            }
        };

        return options;
    };


    return config;
}